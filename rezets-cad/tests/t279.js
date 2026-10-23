// The last document can be deleted: an empty part takes its place, and «Отменить» brings it back and drops the empty
// part. Deleting the open document opens the one used before it. The theme is chosen in Файл → Оформление.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const names = () => p.evaluate(() => [window.__rezets.S.project.docs.map((d) => d.name), window.__rezets.activeEntry().name]);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; for (const d of S.project.docs.slice(1)) S.project.docs.splice(S.project.docs.indexOf(d), 1); });
  const one = await names(); await p.evaluate(() => window.__rezets.deleteDoc(window.__rezets.activeEntry(), true)); await p.waitForTimeout(400); const blank = await names();
  await p.click('#toasts .toast .acts button'); await p.waitForTimeout(500); const back = await names();
  await p.evaluate(() => { const R = window.__rezets; R.addDoc('part', 'A', { name: 'A', nid: 1, rollback: null, features: [] }); R.addDoc('part', 'B', { name: 'B', nid: 1, rollback: null, features: [] }); R.switchDoc(R.S.project.docs[0].id); R.switchDoc(R.S.project.docs.find((d) => d.name === 'B').id); R.deleteDoc(R.activeEntry(), true); });
  await p.waitForTimeout(400); const afterDel = await names();
  await p.click('#bFile'); await p.click('#menu button >> text=Оформление'); await p.click('#menu button >> text=Тёмное'); await p.waitForTimeout(200);
  const theme = await p.evaluate(() => [document.documentElement.getAttribute('data-theme'), localStorage.getItem('rezets-theme')]);
  console.log(JSON.stringify({ one, blank, back, afterDel, theme }));
  console.log('expect blank: one «Деталь» open; back: only the original, open; afterDel: the first document (opened before B) is open; theme [dark, dark]');
  console.log(logs.join('\n')); await b.close(); })();

// Switching documents keeps each one's view and the sketch that was being edited.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const st = () => p.evaluate(() => { const R = window.__rezets; const S = R.S; return JSON.stringify({ doc: S.project.active, editing: S.editing, tab: document.querySelector('.tab[aria-selected=true]')?.textContent }); });
  const cam = () => p.evaluate(() => { const c = window.__rezets.camInfo(); return c.map((v) => v.toFixed(2)).join(','); });
  await p.evaluate(() => { const R = window.__rezets; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.switchDoc(id); });
  await p.click('[data-view="iso"]'); await p.waitForTimeout(400);
  await p.locator('#side .row', { hasText: 'Эскиз2' }).dblclick(); await p.waitForTimeout(600);
  const c0 = await cam(); console.log('editing', await st());
  await p.locator('#docTabs .doctab', { hasText: 'Сборка' }).click(); await p.waitForTimeout(500); console.log('assembly', await st());
  await p.locator('#docTabs .doctab', { hasText: 'Кронштейн' }).click(); await p.waitForTimeout(600);
  console.log('back', await st(), '| same view:', (await cam()) === c0, '| planes group visible:', await p.evaluate(() => window.__rezets.groups.planes.visible));
  console.log(logs.join('\n')); await b.close();
})();

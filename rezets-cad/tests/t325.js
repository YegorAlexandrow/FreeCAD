// S with a sketch picked in the tree opens that sketch for editing instead of starting a new one (A36).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc(R.sampleDoc()); R.rebuild(); R.renderSide(); });
  const n0 = await p.evaluate(() => window.__rezets.S.doc.features.length);
  const sk = await p.evaluate(() => { const S = window.__rezets.S; const f = S.doc.features.find((x) => x.type === 'sketch'); const row = document.querySelector(`#side .row[data-fid="${f.id}"]`) || [...document.querySelectorAll('#side .row')].find((r) => r.textContent.includes(f.name)); row.click(); return { id: f.id, sel: S.selectedTree }; });
  await p.keyboard.press('s'); await p.waitForTimeout(400);
  const r = await p.evaluate(() => { const S = window.__rezets.S; return { editing: S.editing, n: S.doc.features.length }; });
  console.log(JSON.stringify({ ...sk, ...r, n0 })); console.log('expect editing = id, n = n0');
  console.log(logs.join('\n')); await b.close(); })();

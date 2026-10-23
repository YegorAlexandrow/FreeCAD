// The feature tree walks with the arrows: down to the next row, Space selects it, Enter opens it; the view stays.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const cam0 = await p.evaluate(() => window.__rezets.camInfo().join());
  await p.focus('#side .tree .row'); const f0 = await p.evaluate(() => document.activeElement.textContent);
  await p.keyboard.press('ArrowDown'); await p.keyboard.press('ArrowDown'); const f1 = await p.evaluate(() => document.activeElement.textContent);
  await p.keyboard.press(' '); await p.waitForTimeout(150); const sel = await p.evaluate(() => window.__rezets.S.selectedTree);
  const cam1 = await p.evaluate(() => window.__rezets.camInfo().join());
  console.log(JSON.stringify({ f0, f1, sel, viewKept: cam0 === cam1 })); console.log('expect f1 two rows below f0, sel set to that row, viewKept true');
  console.log(logs.join('\n')); await b.close(); })();

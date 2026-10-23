// H56: in the tape measure a second click on the same face takes it out again; a click on empty space starts over.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800); await p.click('[data-view="iso"]'); await p.waitForTimeout(800);
  const s = await p.evaluate(() => { const R = window.__rezets; const h = R.castRay([-28, 100, 18], [0, -1, 0])[0]; return R.toScreen(h.point); }); const box = await (await p.$('#cv')).boundingBox();
  await p.evaluate(() => window.__rezets.cmdMeasure()); const n = () => p.evaluate(() => window.__rezets.S.measure.picks.length);
  await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(200); const a = await n(); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(200); const b2 = await n();
  await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(200); await p.mouse.click(box.x + 30, box.y + 30); await p.waitForTimeout(200); const c = await n();
  console.log(JSON.stringify({ a, b: b2, c })); console.log('expect a 1, b 0, c 0');
  console.log(logs.join('\n')); await b.close(); })();

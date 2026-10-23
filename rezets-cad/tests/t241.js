// H33: Hole on a picked face opens a sketch for the centres; Esc with nothing put there cancels the hole, the empty
// sketch goes and nothing waits for it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800); await p.click('[data-view="iso"]'); await p.waitForTimeout(800);
  const s = await p.evaluate(() => { const R = window.__rezets; const h = R.castRay([-28, 100, 18], [0, -1, 0])[0]; return R.toScreen(h.point); });
  const box = await (await p.$('#cv')).boundingBox(); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(300);
  const n0 = await p.evaluate(() => window.__rezets.S.doc.features.length);
  await p.click('button.tool:has-text("Отверстие")'); await p.waitForTimeout(400); const ed = await p.evaluate(() => !!window.__rezets.S.editing);
  await p.mouse.move(box.x + 50, box.y + 50); await p.keyboard.press('Escape'); await p.waitForTimeout(200); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  console.log(JSON.stringify({ ed, after: await p.evaluate(() => [!!window.__rezets.S.editing, window.__rezets.S.afterSketch || null, window.__rezets.S.doc.features.length]), n0 }));
  console.log('expect ed true, after [false, null, n0]');
  console.log(logs.join('\n')); await b.close(); })();

// Part, face and component colours.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.click('[data-view="iso"]'); await p.waitForTimeout(500);
  const box = await (await p.$('#cv')).boundingBox();
  const scr = (x, y, z) => p.evaluate(([x, y, z]) => window.__rezets.toScreen(new (window.__rezets.S.body.boundingBox?.min?.constructor || Object)(x, y, z)), [x, y, z]);
  await p.evaluate(() => window.__rezets.S.body.computeBoundingBox());
  // right-click on the plate top face -> face colour red
  const s1 = await scr(-40, 12, 20); await p.mouse.click(box.x + s1.x, box.y + s1.y, { button: 'right' }); await p.waitForTimeout(200);
  L('menu', await p.$$eval('#menu button', (els) => els.map((e) => e.textContent).filter(Boolean).join(' | ')));
  await p.locator('#menu button', { hasText: 'Цвет грани' }).click(); await p.waitForTimeout(150);
  await p.locator('#menu .sw[title="Красный"]').click(); await p.waitForTimeout(300);
  // right-click on the boss cylinder -> cylindrical face blue
  const s2 = await scr(0, 22, 22); await p.mouse.click(box.x + s2.x, box.y + s2.y, { button: 'right' }); await p.waitForTimeout(200);
  await p.locator('#menu button', { hasText: 'Цвет' }).first().click(); await p.waitForTimeout(150); await p.locator('#menu .sw[title="Синий"]').click(); await p.waitForTimeout(300);
  // part colour
  const s3 = await scr(-40, 12, 20); await p.mouse.click(box.x + s3.x, box.y + s3.y, { button: 'right' }); await p.waitForTimeout(150);
  await p.locator('#menu button', { hasText: 'Цвет детали' }).click(); await p.waitForTimeout(150); await p.locator('#menu .sw[title="Латунь"]').click(); await p.waitForTimeout(300);
  L('data', await p.evaluate(() => { const d = window.__rezets.S.doc; return JSON.stringify({ color: d.color, faces: (d.faceColors || []).map((f) => f.kind + ':' + f.color) }); }));
  await p.screenshot({ path: 's47_part.png' });
  await p.keyboard.press('Control+z'); await p.waitForTimeout(300); L('undo', await p.evaluate(() => window.__rezets.S.doc.color || 'none'));
  L(logs.join('\n')); await b.close();
})();

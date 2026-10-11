const open = require('./harness.js');
(async () => {
  const { b, p } = await open();
  await p.evaluate(() => { const R = window.__rezets; });
  // zoom on the left hole and the boss
  const box = await (await p.$('#cv')).boundingBox();
  await p.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.45);
  for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, -200); await p.waitForTimeout(60); }
  await p.waitForTimeout(400); await p.screenshot({ path: 'shot12.png' }); await b.close();
})();

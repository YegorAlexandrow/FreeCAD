// Faces and operations: a cylinder is one face; clicking a face names the operation that made it;
// selecting an operation in the tree highlights the faces it left on the part.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.click('[data-view="iso"]'); await p.waitForTimeout(500);
  await p.evaluate(() => window.__rezets.S.body.computeBoundingBox());
  const box = await (await p.$('#cv')).boundingBox();
  const at = async (x, y, z) => { const s = await p.evaluate(([x, y, z]) => window.__rezets.toScreen(new (window.__rezets.S.body.boundingBox.min.constructor)(x, y, z)), [x, y, z]); return [box.x + s.x, box.y + s.y]; };
  const hint = () => p.$eval('#hint', (e) => e.textContent);
  // the sample bracket: plate (Бобышка1, top y=12), boss cylinder r22 (Бобышка2), bore r12 (Вырез1)
  let [x, y] = await at(-40, 12, 20); await p.mouse.click(x, y); await p.waitForTimeout(300);
  L('plate top:', await hint(), '| origin row:', await p.$eval('#side .row.origin .nm', (e) => e.textContent).catch(() => 'none'));
  [x, y] = await at(0, 22, 22); await p.mouse.move(x, y); await p.waitForTimeout(200);
  L('hovered cylinder triangles:', await p.evaluate(() => { const g = window.__rezets.groups.hover.children[0]?.geometry; return g ? g.getAttribute('position').count / 3 : 0; }));
  await p.mouse.click(x, y); await p.waitForTimeout(300);
  L('boss side:', await hint(), '| origin row:', await p.$eval('#side .row.origin .nm', (e) => e.textContent).catch(() => 'none'));
  await p.locator('#side .row', { hasText: 'Вырез1' }).click(); await p.waitForTimeout(400);
  L('tree Вырез1:', await hint());
  await p.locator('#side .row', { hasText: 'Бобышка2' }).click(); await p.waitForTimeout(400);
  L('tree Бобышка2:', await hint()); await p.screenshot({ path: 's61.png' });
  L(logs.join('\n')); await b.close();
})();

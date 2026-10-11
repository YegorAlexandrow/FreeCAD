// Reference planes: offset plane, sketch on it follows the plane.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  const vol = () => p.evaluate(() => { const R = window.__rezets; const S = R.S; S.body.computeBoundingBox(); const bb = S.body.boundingBox; return { vol: +R.geoVolume(S.body).toFixed(2), ymax: +bb.max.y.toFixed(4) }; });
  const v0 = await vol(); L('sample', JSON.stringify(v0));
  await p.locator('.row', { hasText: 'Сверху' }).click();
  await p.click('button.tool:has-text("Плоскость")'); await p.waitForTimeout(200);
  await p.fill('#pmDist', '50'); await p.press('#pmDist', 'Enter'); await p.waitForTimeout(400);
  L('tree', await p.$$eval('.tree .row .nm', (els) => els.map((e) => e.textContent).join(', ')));
  await p.screenshot({ path: 's31_plane.png' });
  // sketch on the plane: select it in the tree, S
  await p.locator('.row', { hasText: 'Плоскость1' }).click(); await p.keyboard.press('s'); await p.waitForTimeout(500);
  L('sketch plane', await p.evaluate(() => { const R = window.__rezets; const f = R.featById(R.S.editing); return JSON.stringify({ o: f.plane.o, n: f.plane.n, ref: f.planeRef }); }));
  await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; const id = String(sk.nid++); sk.pts[id] = { id, x: 0, y: 0 }; const e = String(sk.nid++); sk.ents[e] = { id: e, t: 'circle', c: id, r: 5 }; R.solveSketch(sk); });
  await p.click('#corner .ok'); await p.waitForTimeout(400);
  await p.keyboard.press('e'); await p.waitForTimeout(300); await p.fill('#pmDepth', '10'); await p.press('#pmDepth', 'Enter'); await p.waitForTimeout(600);
  const v1 = await vol(); L('boss on plane', JSON.stringify(v1), 'added', (v1.vol - v0.vol).toFixed(2), 'expect', (Math.PI * 250).toFixed(2), 'ymax expect 60');
  // edit plane offset -> 70
  await p.locator('.row', { hasText: 'Плоскость1' }).dblclick(); await p.waitForTimeout(300);
  await p.fill('#pmDist', '70'); await p.press('#pmDist', 'Enter'); await p.waitForTimeout(600);
  L('after plane edit', JSON.stringify(await vol()), 'ymax expect 80', JSON.stringify(await p.evaluate(() => window.__rezets.S.errors)));
  await p.keyboard.press('f'); await p.waitForTimeout(400); await p.screenshot({ path: 's31_boss.png' });
  // plane from a face: click the top face of the plate (y=12) via API selection then command
  L(logs.join('\n')); await b.close();
})();

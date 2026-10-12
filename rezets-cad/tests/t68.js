// A sketch started on a face follows that face when the part changes: thicker plate, the boss on
// its top moves up with it instead of ending up inside the material.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  await p.click('[data-view="iso"]'); await p.waitForTimeout(400);
  await p.evaluate(() => window.__rezets.S.body.computeBoundingBox());
  const box = await (await p.$('#cv')).boundingBox();
  const s = await p.evaluate(() => window.__rezets.toScreen(new (window.__rezets.S.body.boundingBox.min.constructor)(-40, 12, 20)));
  await p.mouse.move(box.x + s.x, box.y + s.y); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(300);
  await p.keyboard.press('s'); await p.waitForTimeout(500);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const f = R.featById(S.editing); const sk = f.sk; const out = { plane: JSON.stringify(f.plane) };
    const c = String(sk.nid++); sk.pts[c] = { id: c, x: -40, y: -20 }; const e = String(sk.nid++); sk.ents[e] = { id: e, t: 'circle', c, r: 6 }; R.solveSketch(sk); R.exitSketch();
    S.doc.features.push({ id: 'fB', type: 'extrude', name: 'Стойка', sketch: f.id, mode: 'add', end: 'blind', depth: 5, dir: 1, regions: null }); R.rebuild();
    const top = () => { S.body.computeBoundingBox(); return +S.body.boundingBox.max.y.toFixed(3); }; const v0 = R.geoVolume(S.body); out.before = { ymaxBoss: top(), vol: +v0.toFixed(1) };
    S.doc.features.find((x) => x.name === 'Бобышка1').depth = 20; R.rebuild();
    // the boss sits on the plate top (y 20) and reaches 25; the bracket's own boss is 20 above y 12 = 32 -> 40 now
    const pts = S.body.getAttribute('position'); let bossTop = -1e9; for (let i = 0; i < pts.count; i++) if (Math.hypot(pts.getX(i) + 40, pts.getZ(i) - 20) < 6.01) bossTop = Math.max(bossTop, pts.getY(i));
    out.after = { planeY: f.plane.o[1], bossTop: +bossTop.toFixed(3), err: JSON.stringify(S.errors) }; return out; });
  console.log(JSON.stringify(r), '\nexpect plane face {by: f..}, after: planeY 20, bossTop 25');
  console.log(logs.join('\n')); await b.close();
})();

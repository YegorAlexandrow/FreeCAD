// G12/G44: a 0.1 mm cube fills the view after Fit, and the planes are sized to it instead of 120 mm.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const s = 0.1; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(s, 0), P(s, s), P(0, s)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: s, dir: 1, regions: null }] }); });
  await p.mouse.move(700, 400); await p.keyboard.press('f'); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; S.body.computeBoundingBox(); const bb = S.body.boundingBox; const p0 = R.toScreen(bb.min), p1 = R.toScreen(bb.max);
    return { cam: R.camInfo().map(v => +v.toFixed(3)), px: Math.round(Math.hypot(p1.x - p0.x, p1.y - p0.y)), plane: R.groups.planes.children.length ? +new (R.S.body.boundingBox.constructor)().setFromObject(R.groups.planes.children[0]).getSize(R.S.body.boundingBox.max.clone()).length().toFixed(2) : null }; })));

  console.log('expect cam[6] (zoom) > 1000 and plane diagonal 2.83 (half-size floor 1 mm), was ~6 and ~170');
  console.log(logs.join('\n')); await b.close(); })();

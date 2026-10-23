// N20: a «Насквозь» hole from a sketch on the middle plane of a block drilled both ways goes through the whole block.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(-20, -20), P(20, -20), P(20, 20), P(-20, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    const hs = R.newSketchData(); const c = String(hs.nid++); hs.pts[c] = { id: c, x: 0, y: 0, free: true, hole: true };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'mid', depth: 20, dir: 1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: R.PLANES.front, sk: hs }, { id: 'f4', type: 'hole', name: 'Отверстие1', sketch: 'f3', kind: 'simple', std: 'M5', dia: 6, end: 'through', depth: 10, dir: 1, tip: true }] });
    S.body.computeBoundingBox(); const hit = (z) => R.castRay([0, 0, z], [0, 0, z > 0 ? -1 : 1]).length;
    return { removed: +(32000 - R.geoVolume(S.body)).toFixed(0), err: JSON.stringify(S.errors), raysTop: hit(30), raysBottom: hit(-30) }; })));
  console.log('expect removed ≈ 565 (π·9·20, faceted), no error, both rays pass through the hole (0 hits)');
  console.log(logs.join('\n')); await b.close(); })();

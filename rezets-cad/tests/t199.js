// N16: a chamfer on the 4 vertical edges of a block survives a corner moved away and back: after the round trip
// all four edges are distinct and chamfered again, the volume is the original one.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(-20, -20), P(20, -20), P(20, 20), P(-20, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    const E = (x, y) => ({ t: 'line', a: [x, y, 0], b: [x, y, 10] });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null },
      { id: 'f3', type: 'chamfer', name: 'Фаска1', d: 2, edges: [E(-20, -20), E(20, -20), E(20, 20), E(-20, 20)] }] });
    const v0 = +R.geoVolume(S.body).toFixed(1); const s1 = R.featById('f1').sk;
    s1.pts[q[2]].x = 0; s1.pts[q[2]].y = 0; R.rebuild(); const mid = S.errors.f3 || null; s1.pts[q[2]].x = 20; s1.pts[q[2]].y = 20; R.rebuild();
    const keys = R.featById('f3').edges.map((e) => e.a.slice(0, 2).map(Math.round).join(',')); return { v0, v1: +R.geoVolume(S.body).toFixed(1), mid, err: S.errors.f3 || null, distinct: new Set(keys).size, keys }; })));
  console.log('expect v1 = v0 (15920), err null, distinct 4');
  console.log(logs.join('\n')); await b.close(); })();

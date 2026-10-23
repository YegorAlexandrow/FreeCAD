// «Перевернуть сторону для резания»: a through cut by a circle keeps the cylinder inside and removes the rest.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    const rect = R.newSketchData(); const P = (sk, x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(rect, -30, -20), P(rect, 30, -20), P(rect, 30, 20), P(rect, -30, 20)]; q.forEach((a, i) => { rect.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    const circ = R.newSketchData(); const c = P(circ, 5, 0); circ.ents.c1 = { id: 'c1', t: 'circle', c, r: 10 }; const hole = R.newSketchData(); const c2 = P(hole, 5, 0); hole.ents.c1 = { id: 'c1', t: 'circle', c: c2, r: 10 }; const c3 = P(hole, 5, 0); hole.ents.c2 = { id: 'c2', t: 'circle', c: c3, r: 4 };
    const run = (sk, regions) => { R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk: rect }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 20, dir: 1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: { ...R.PLANES.top, o: [0, 20, 0] }, sk }, { id: 'f4', type: 'extrude', name: 'Вырез1', sketch: 'f3', mode: 'cut', end: 'through', depth: 10, dir: -1, regions, flipSide: true }] });
      return { vol: +R.geoVolume(S.body).toFixed(1), err: Object.values(S.errors) }; };
    return { disc: run(circ, null), ring: run(hole, [0]) }; });
  console.log(JSON.stringify(r));
  console.log('expect disc vol ≈ 6283 (π·10²·20, 6281 with the circle as a polygon), ring ≈ 5278 (π·(10²−4²)·20), no errors');
  console.log(logs.join('\n')); await b.close(); })();

// A fillet wider than the face next to it is refused with the numbers (face width, largest radius that fits)
// instead of a body turned inside out; one that fits still works.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(40, 0), P(40, 6), P(0, 6)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    const doc = (r) => ({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: JSON.parse(JSON.stringify(sk)) }, { id: 'f2', type: 'extrude', name: 'Б1', sketch: 'f1', mode: 'add', end: 'blind', depth: 20, dir: 1, regions: null },
      { id: 'f3', type: 'fillet', name: 'Скругление1', r, edges: [{ t: 'line', a: [0, 6, 0], b: [40, 6, 0] }] }] });
    R.loadDoc(doc(10)); const big = S.errors.f3 || null; const vBig = +R.geoVolume(S.body).toFixed(1);
    R.loadDoc(doc(3)); const ok = S.errors.f3 || null; const vOk = +R.geoVolume(S.body).toFixed(1); return { big, vBig, ok, vOk }; })));
  console.log('expect big «Радиус 10 не помещается: … шириной около 6 мм, наибольший радиус около 6»; ok null, vOk = 4800 - (9 - 9π/4)·40 ≈ 4722.7');
  console.log(logs.join('\n')); await b.close(); })();

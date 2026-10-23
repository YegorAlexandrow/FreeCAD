// A cut that misses the part says so; Extrude (E) with a planar face picked opens a sketch on that face and comes
// back to the extrusion when the sketch is closed.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const out = await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(40, 0), P(40, 20), P(0, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    const sk2 = R.newSketchData(); const h = String(sk2.nid++); sk2.pts[h] = { id: h, x: 100, y: 10 }; sk2.ents.h = { id: 'h', t: 'circle', c: h, r: 3 };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Б1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: R.PLANES.front, sk: sk2 }, { id: 'f4', type: 'extrude', name: 'Вырез1', sketch: 'f3', mode: 'cut', end: 'through', depth: 10, dir: 1, regions: null }] });
    const o = { warn: S.warns.f4, err: S.errors.f4 || null };
    S.selectedTree = 'face'; S.pickedFace = { label: 'Грань', o: [0, 0, 10], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] }; R.cmdFeature('extrude', 'add'); o.editing = !!S.editing; o.after = S.afterSketch; return o; });
  console.log(JSON.stringify(out)); console.log('expect warn «Вырез не задевает деталь…», err null; editing true, after {extrude, add}');
  console.log(logs.join('\n')); await b.close(); })();

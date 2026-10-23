// «Контур грани» on an offset plane: clicking above a face parallel to the sketch projects that face's outline
// (its hole as a circle) into the sketch.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(-10, -6), P(10, -6), P(10, 6), P(-10, 6)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); sk.ents.h = { id: 'h', t: 'circle', c: P(3, 0), r: 2 };
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 4, dir: 1, regions: null }] });
    R.startSketch({ label: 'Плоскость', o: [0, 0, 20], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] }); R.setTool('convert');
    const f = S.doc.features.find((g) => g.id === S.editing); const r = R.convertFace(f.sk, { u: -5, v: 2 }); const ents = Object.values(f.sk.ents).map((e) => e.t).sort(); R.commitSketch(); R.exitSketch();
    return { r, ents }; })));
  console.log('expect r 5, ents [circle, line×4]');
  console.log(logs.join('\n')); await b.close(); })();

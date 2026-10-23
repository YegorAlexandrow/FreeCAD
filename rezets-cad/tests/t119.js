// «Контур грани»: a sketch on a face takes the outline of the face clicked (outer edge and holes) as fixed lines,
// and extruding it adds the same shape on top. A plate with a hole, then a STEP model's face.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(-10, -6), P(10, -6), P(10, 6), P(-10, 6)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); sk.ents.h = { id: 'h', t: 'circle', c: P(3, 0), r: 2 };
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 4, dir: 1, regions: null }] });
    const v0 = R.geoVolume(S.body);
    R.startSketch({ label: 'Грань', o: [0, 0, 4], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1], face: { by: 'f2', d: 4 } }); R.setTool('convert');
    const f = S.doc.features.find((g) => g.id === S.editing); const r = R.convertFace ? R.convertFace(f.sk, { u: -5, v: 2 }) : null; R.commitSketch(); R.exitSketch();
    const regs = R.sketchRegionsOf(f).faces.map((x) => +x.area.toFixed(1));
    S.selectedTree = 'feat:' + f.id; R.cmdFeature('extrude', 'add'); S.pm.feature.depth = 3; R.okPM();
    return { lines: r, regs, dv: +(R.geoVolume(S.body) - v0).toFixed(1), err: JSON.stringify(S.errors) }; })));
  console.log('expect lines 5 (rectangle + the hole as one circle), regions [240, 12.5] (the plate with its hole, the hole), dv 682 (227.4 * 3), no errors');
  console.log(logs.join('\n')); await b.close(); })();

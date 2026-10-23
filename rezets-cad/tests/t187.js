// F13: the plate's right side becomes slanted (x 7 at the front, 9 at the back): the converted top outline's ends
// slide along their own edges to the new corners instead of being lost.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(-10, -6), P(10, -6), P(10, 6), P(-10, 6)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 4, dir: 1, regions: null }] });
    R.startSketch({ label: 'Грань', o: [0, 0, 4], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1], face: { by: 'f2', d: 4 } }); R.setTool('convert');
    const f = S.doc.features.find((g) => g.id === S.editing); R.convertFace(f.sk, { u: -5, v: 2 }); R.commitSketch(); R.exitSketch();
    S.selectedTree = 'feat:' + f.id; R.cmdFeature('extrude', 'add'); S.pm.feature.depth = 3; R.okPM(); const v0 = +R.geoVolume(S.body).toFixed(1);
    const s1 = R.featById('f1').sk; s1.pts[q[1]].x = 7; s1.pts[q[2]].x = 9; R.rebuild();
    const xs = Object.values(f.sk.pts).map((pt) => +pt.x.toFixed(2)).sort((a, c) => a - c);
    return { v0, v1: +R.geoVolume(S.body).toFixed(1), xs, lost: Object.values(f.sk.pts).filter((pt) => pt.lost).length, dangling: [...S.dangling.keys()], err: JSON.stringify(S.errors), warns: JSON.stringify(S.warns || {}) }; })));
  console.log('expect v0 1680, v1 1512 (trapezoid 216 * 7), xs -10 -10 7 9, lost 0, dangling [], no errors');
  console.log(logs.join('\n')); await b.close(); })();

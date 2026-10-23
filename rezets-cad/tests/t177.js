// The outline taken by «Контур грани» stays tied to the model: when the plate grows, its corners follow.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(-10, -6), P(10, -6), P(10, 6), P(-10, 6)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 4, dir: 1, regions: null }] });
    R.startSketch({ label: 'Грань', o: [0, 0, 4], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1], face: { by: 'f2', d: 4 } }); R.setTool('convert');
    const f = S.doc.features.find((g) => g.id === S.editing); R.convertFace(f.sk, { u: -5, v: 2 }); R.commitSketch(); R.exitSketch();
    sk.pts[q[1]].x = 15; sk.pts[q[2]].x = 15; R.rebuild(); const xs = Object.values(f.sk.pts).map((p2) => +p2.x.toFixed(3)).sort((a, c) => a - c);
    return { xs, lost: S.dangling.get(f.id) || null, err: JSON.stringify(S.errors) }; })));
  console.log('expect xs [-10,-10,15,15] (the right side followed), lost null');
  console.log(logs.join('\n')); await b.close(); })();

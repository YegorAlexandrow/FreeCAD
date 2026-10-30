// J57: splitting a line or an arc at a point: two pieces meeting there, kept on one line (one circle, equal radii).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; };
    P('a', 0, 0); P('b', 20, 0); sk.ents.A = { id: 'A', t: 'line', p1: 'a', p2: 'b' }; P('o', 50, 0); P('s', 60, 0); P('t', 40, 0); sk.ents.C = { id: 'C', t: 'arc', c: 'o', p1: 's', p2: 't', r: 10 }; sk.nid = 100;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); const k = R.featById('f1').sk;
    R.splitAt(k, k.ents.A, { u: 8, v: 3 }); R.splitAt(k, k.ents.C, { u: 50, v: 12 });
    const lines = Object.values(k.ents).filter((e) => e.t === 'line').map((e) => [k.pts[e.p1].x, k.pts[e.p2].x].map((v) => +v.toFixed(2))); const arcs = Object.values(k.ents).filter((e) => e.t === 'arc').map((e) => [+k.pts[e.p2].x.toFixed(2), +k.pts[e.p2].y.toFixed(2)]);
    return { lines, arcs, cons: Object.values(k.cons).map((c) => c.t).sort() }; });
  console.log(JSON.stringify(r)); console.log('expect lines [[0,8],[8,20]], arcs ending at [50,10] and [40,0], cons [] (the halves meet at the split point; two arcs through it about one centre are one circle already)');
  console.log(logs.join('\n')); await b.close(); })();

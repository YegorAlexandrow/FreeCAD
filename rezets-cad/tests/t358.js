// S0-15: a fillet where a line meets an arc: an arc of the radius tangent to both, the line and the arc cut back to it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; };
    // A line along y = 0 from (-20,0) to (0,0), then a half circle of radius 10 around (10,0) from (0,0) up over to (20,0).
    P('a', -20, 0); P('k', 0, 0); P('o', 10, 0); P('e', 20, 0); sk.ents.L = { id: 'L', t: 'line', p1: 'a', p2: 'k' }; sk.ents.A = { id: 'A', t: 'arc', c: 'o', p1: 'e', p2: 'k', r: 10 }; sk.nid = 100;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); R.S.toolOpt.filletR = 2;
    const res = R.filletCorner(sk, 'k', 2); R.solveSketch(sk); const f = sk.ents[res.arc]; const g = (id) => sk.pts[id];
    const dist = (q, c) => Math.hypot(q.x - c.x, q.y - c.y);
    return { ok: !!f, r: f && +f.r.toFixed(4), onLine: +g(sk.ents.L.p2).y.toFixed(4), lineEnd: +g(sk.ents.L.p2).x.toFixed(3), arcEndOnArc: +dist(g(sk.ents.A.p2 === 'k' ? sk.ents.A.p2 : (sk.ents.A.p1 === 'e' ? sk.ents.A.p2 : sk.ents.A.p1)), g('o')).toFixed(4),
      tangentToArc: +(dist(g(f.c), g('o')) - 10).toFixed(4), cut: !sk.pts.k, dof: R.analyzeSketch(sk).dof }; });
  console.log(JSON.stringify(r)); console.log('expect ok, r 2, onLine 0, lineEnd < 0, arcEndOnArc 10, tangentToArc 2 (outside) or -2, cut true');
  console.log(logs.join('\n')); await b.close(); })();

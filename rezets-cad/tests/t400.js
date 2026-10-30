// P0-42: three R6 fillets meeting at a box corner end in a sphere: the corner loses (Steinmetz octant − ball octant)
// = (2 − √2 − π/6)·r³ more than the three swept fillets alone.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; };
    const a = P(0, 0), bb = P(40, 0), c = P(40, 30), d = P(0, 30); for (const [u, v] of [[a, bb], [bb, c], [c, d], [d, a]]) { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: v }; }
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 20, dir: 1, regions: null }] });
    const T = R.edgeTopology(S.body, S.cyls); const at = (v) => Math.abs(v.x - 40) < 1e-4 && Math.abs(v.y - 20) < 1e-4 && Math.abs(Math.abs(v.z) - 30) < 1e-4;
    const es = T.lines.filter(([u, v]) => at(u) || at(v)).map(([u, v]) => ({ t: 'line', a: u.toArray(), b: v.toArray() }));
    const base = S.body; const sep = es.reduce((g, e) => R.applyEdgeFeature({ id: 'x', type: 'fillet', name: 'x', r: 6, edges: [e] }, g), base);
    S.doc.features.push({ id: 'f3', type: 'fillet', name: 'Скругление1', r: 6, edges: es }); const t0 = performance.now(); R.rebuild(); const ms = performance.now() - t0;
    const extra = R.geoVolume(sep) - R.geoVolume(S.body); return { edges: es.length, err: S.errors.f3 || null, extra: +extra.toFixed(1), want: +((2 - Math.SQRT2 - Math.PI / 6) * 216).toFixed(1), slow: ms > 3000 }; })));
  console.log('expect 3 edges, no error, extra ≈ want (13.4), not slow');
  console.log(logs.join('\n')); await b.close(); })();

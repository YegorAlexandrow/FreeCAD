const open = require('./harness.js');
const vol = (g) => { const pos = g.getAttribute('position'); let v = 0; for (let i = 0; i < pos.count; i += 3) { const a = [pos.getX(i), pos.getY(i), pos.getZ(i)], b = [pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1)], c = [pos.getX(i + 2), pos.getY(i + 2), pos.getZ(i + 2)]; v += a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]); } return v / 6; };
(async () => {
  const { b, p, logs } = await open();
  const r = await p.evaluate((volSrc) => {
    const vol = eval('(' + volSrc + ')'); const R = window.__rezets; const S = R.S; const out = {};
    const base = S.body; const V0 = vol(base); const T = R.edgeTopology(base, S.cyls);
    // 1. convex straight edge: plate top front edge, y=12, z=40, x -60..60
    const e1 = T.lines.find(([a, b]) => Math.abs(a.y - 12) < 1e-6 && Math.abs(b.y - 12) < 1e-6 && Math.abs(a.z - 40) < 1e-6 && Math.abs(b.z - 40) < 1e-6);
    const f1 = { type: 'fillet', r: 3, edges: [{ t: 'line', a: e1[0].toArray(), b: e1[1].toArray() }] };
    const b1 = R.applyEdgeFeature(f1, base); out.filletLine = { removed: V0 - vol(b1), exact: 120 * 9 * (1 - Math.PI / 4) };
    const f1c = { type: 'chamfer', d: 2, edges: f1.edges }; const b1c = R.applyEdgeFeature(f1c, base); out.chamferLine = { removed: V0 - vol(b1c), exact: 120 * 2 };
    // 2. convex circular edge: boss top outer rim r=22 at y=32
    const c2 = T.circles.find(c => Math.abs(c.r - 22) < 1e-6 && c.c.y > 30);
    const A = 4 * (1 - Math.PI / 4), k = 2 * (10 - 3 * Math.PI) / (3 * (4 - Math.PI));
    const b2 = R.applyEdgeFeature({ type: 'fillet', r: 2, edges: [{ t: 'circle', c: c2.c.toArray(), n: c2.n.toArray(), r: c2.r }] }, base);
    out.filletRim = { removed: V0 - vol(b2), exact: 2 * Math.PI * (22 - k) * A };
    // 3. concave circular edge: boss base r=22 at y=12 (adds material)
    const c3 = T.circles.find(c => Math.abs(c.r - 22) < 1e-6 && Math.abs(c.c.y - 12) < 1e-6);
    const b3 = R.applyEdgeFeature({ type: 'fillet', r: 2, edges: [{ t: 'circle', c: c3.c.toArray(), n: c3.n.toArray(), r: c3.r }] }, base);
    out.filletBase = { added: vol(b3) - V0, exact: 2 * Math.PI * (22 + k) * A };
    // 4. hole edge chamfer (convex circular, hole r=12 at the top of the bore)
    const c4 = T.circles.find(c => Math.abs(c.r - 12) < 1e-6 && c.c.y > 30);
    const b4 = R.applyEdgeFeature({ type: 'chamfer', d: 1, edges: [{ t: 'circle', c: c4.c.toArray(), n: c4.n.toArray(), r: c4.r }] }, base);
    out.chamferHole = { removed: V0 - vol(b4), exact: 2 * Math.PI * (12 + 1 / 3) * 0.5 };
    return out;
  }, vol.toString());
  for (const [k, v] of Object.entries(r)) { const a = v.removed ?? v.added; console.log(k.padEnd(12), a.toFixed(3), 'exact', v.exact.toFixed(3), 'err', ((a - v.exact) / v.exact * 100).toFixed(3) + '%'); }
  console.log(logs.join('\n')); await b.close();
})();

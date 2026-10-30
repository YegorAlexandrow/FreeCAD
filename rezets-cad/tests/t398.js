// P0-43: the curved top edge of a part drawn with a spline is found, picked and rounded; an ellipse boss's rim too.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); const L = (...a) => console.log(...a);
  L(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    const sk = R.newSketchData(); const P = (id, x, y) => { sk.pts[id] = { id, x, y }; return id; };
    P('a', -40, 0); P('b', 40, 0); P('s1', 20, 25); P('s2', -20, 25); sk.ents.l = { id: 'l', t: 'line', p1: 'a', p2: 'b' }; sk.ents.sp = { id: 'sp', t: 'spline', pts: ['b', 's1', 's2', 'a'], p1: 'b', p2: 'a', closed: false };
    const sk2 = R.newSketchData(); sk2.pts.c = { id: 'c', x: 0, y: 0 }; sk2.pts.ax = { id: 'ax', x: 30, y: 0 }; sk2.ents.e = { id: 'e', t: 'ellipse', c: 'c', p1: 'ax', r: 15 };
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null }] });
    const T = R.edgeTopology(S.body, S.cyls); const out = { curves: (T.curves || []).length };
    const top = (T.curves || []).find((C) => C.every((v) => Math.abs(v.y - 10) < 1e-4)); out.top = !!top;
    if (top) { const e = { t: 'curve', pts: top.map((v) => v.toArray()) }; const v0 = R.geoVolume(S.body);
      try { const g = R.applyEdgeFeature({ id: 'fx', type: 'fillet', name: 'x', r: 2, edges: [e] }, S.body); out.filletDv = +(R.geoVolume(g) - v0).toFixed(1); } catch (err) { out.filletErr = err.message; }
      try { const g = R.applyEdgeFeature({ id: 'fy', type: 'chamfer', name: 'y', d: 1.5, edges: [e] }, S.body); out.chamferDv = +(R.geoVolume(g) - v0).toFixed(1); } catch (err) { out.chamferErr = err.message; }
      // the fillet as a feature of the part, rebuilt
      S.doc.features.push({ id: 'f3', type: 'fillet', name: 'Скругление1', r: 2, edges: [e] }); R.rebuild(); out.err = S.errors.f3 || null; out.v1 = +R.geoVolume(S.body).toFixed(1); out.v0 = +v0.toFixed(1);
      // a longer extrusion: the edge is followed
      S.doc.features[1].depth = 14; R.rebuild(); out.after = S.errors.f3 || null; out.v2 = +R.geoVolume(S.body).toFixed(1); }
    // an elliptic boss: its top rim is one closed curve, rounded all round
    R.loadDoc({ name: 'Э', nid: 10, rollback: null, features: [{ id: 'g1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk: sk2 }, { id: 'g2', type: 'extrude', name: 'Бобышка1', sketch: 'g1', mode: 'add', end: 'blind', depth: 8, dir: 1, regions: null }] });
    const T2 = R.edgeTopology(S.body, S.cyls); const rim = (T2.curves || []).find((C) => C.every((v) => Math.abs(v.y - 8) < 1e-4)); out.rim = rim ? rim.length : 0;
    if (rim) { const w0 = R.geoVolume(S.body); try { const g = R.applyEdgeFeature({ id: 'fz', type: 'fillet', name: 'z', r: 2, edges: [{ t: 'curve', pts: rim.map((v) => v.toArray()) }] }, S.body); out.rimDv = +(R.geoVolume(g) - w0).toFixed(1); } catch (err) { out.rimErr = err.message; } }
    return out; })));
  L('expect a top curve, fillet removes about (1-π/4)·4·L ≈ 0.86·L mm³ (L ≈ 100 mm → ≈ -86), chamfer ≈ -1.125·L, no errors, edge followed after a taller extrusion; the ellipse rim (perimeter ≈ 145 mm) loses ≈ 0.86·145 ≈ 124 minus a little for its curvature');
  L(logs.join('\n')); await b.close(); })();

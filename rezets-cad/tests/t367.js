// ARM1 rolled back to its 27th operation: R3 where the lever's bottom meets the round boss (an inside corner, material
// added). The piece runs a little into the boss past its faceted face: bounded by the true arc it left teeth between
// the facets and a hair at the end of the fillet.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/arm1-rolled.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild(); const v0 = R.geoVolume(S.body); const T = R.edgeTopology(S.body, S.cyls);
    const edges = T.lines.filter(([a, b]) => Math.abs(a.x + 11.225) < 0.01 && Math.abs(a.y + 9) < 0.01 && Math.abs(a.x - b.x) < 1e-6 && Math.abs(a.y - b.y) < 1e-6).map(([a, b]) => ({ t: 'line', a: a.toArray(), b: b.toArray() }));
    const at = S.doc.rollback; S.doc.features.splice(at, 0, { id: 'fz', type: 'fillet', name: 'Скругление', r: 3, edges }); S.doc.rollback++; R.rebuild();
    const T2 = R.edgeTopology(S.body, S.cyls); const short = T2.lines.filter(([a, b]) => a.distanceTo(b) < 0.3 && Math.abs(a.z) > 16 && Math.hypot(a.x + 11, a.y + 9) < 4).length;
    return { edges: edges.length, dv: +(R.geoVolume(S.body) - v0).toFixed(2), err: S.errors.fz || null, slivers: short }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect edges 2, dv 2.76 (both plates), err null, slivers 0');
  console.log(logs.join('\n')); await b.close(); })();

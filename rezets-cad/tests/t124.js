// The user's gripper: where flat walls run into the round parts at a corner, the edge lies on the cylinder along its
// axis, but it is a real edge: it is found, and a fillet goes on it.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/gripper.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc);
    const T = R.edgeTopology(S.body, S.cyls); const vert = T.lines.filter(([a, c]) => Math.abs(a.x - c.x) < 1e-4 && Math.abs(a.y - c.y) < 1e-4).map(([a]) => [+a.x.toFixed(2), +a.y.toFixed(2)]).sort((u, w) => u[0] - w[0] || u[1] - w[1]);
    const v0 = R.geoVolume(S.body);
    const tries = vert.map(([x, y]) => { const f = { id: 'fx', type: 'fillet', name: 'x', r: 0.5, edges: [{ t: 'line', a: [x, y, -6], b: [x, y, 6] }] }; try { const g = R.applyEdgeFeature(f, S.body); return +(R.geoVolume(g) - v0).toFixed(3); } catch (e) { return e.message; } });
    return { vert, tries, err: S.errors }; }, doc)));
  console.log('expect vertical edges at the wall/arc corners (x ±0.5 y 20, ±2 y 21.28, ±7 / ±8.5 y 13.02 ...), each fillet a small volume change, no error text');
  console.log(logs.join('\n')); await b.close(); })();

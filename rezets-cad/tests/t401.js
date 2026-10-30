// P0-43: the gripper's curved edges (cylinders cut by inclined faces) are whole curves, not 0.2 mm straight pieces,
// and each takes a fillet.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/gripper.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); const T = R.edgeTopology(S.body, S.cyls); const v0 = R.geoVolume(S.body);
    const out = { curves: T.curves.length, short: T.lines.filter(([a, c]) => a.distanceTo(c) < 0.5).length, fillets: [] };
    for (const C of T.curves) { try { const g = R.applyEdgeFeature({ id: 'x', type: 'fillet', name: 'x', r: 0.3, edges: [{ t: 'curve', pts: C.map((v) => v.toArray()) }] }, S.body, S.cyls, S.doc.features); out.fillets.push(+(R.geoVolume(g) - v0).toFixed(3)); } catch (e) { out.fillets.push(e.message); } }
    return out; }, doc)));
  console.log('expect 4 curves, at most a couple of short lines (the 0.33 mm steps at the ends), four small volume changes');
  console.log(logs.join('\n')); await b.close(); })();

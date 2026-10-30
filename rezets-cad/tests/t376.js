// P0-13: picking an edge for a fillet takes the edges that run on smoothly from it (SolidWorks' tangent propagation):
// ARM1's straight top edge at y = 9 runs into the R12.5 rim of the boss it is tangent to; corners are not crossed.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/arm1-rolled.json', 'utf8')); doc.rollback = null;
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild(); const T = R.edgeTopology(S.body, S.cyls);
    const pick = (x0, y0, x1, y1) => { const [a, b] = T.lines.find(([a, b]) => Math.abs(a.z - 19.5) < 1e-3 && Math.abs(b.z - 19.5) < 1e-3 && Math.hypot(a.x - x0, a.y - y0) < 0.1 && Math.hypot(b.x - x1, b.y - y1) < 0.1); return { t: 'line', a: a.toArray(), b: b.toArray() }; };
    const ch1 = R.tangentChain(T, pick(-20, 9, 0, 9)).map((x) => x.t + (x.r ? x.r : '')); const ch2 = R.tangentChain(T, pick(-151.94, -9, -40, -9)).length;
    const v0 = R.geoVolume(S.body); S.doc.features.push({ id: 'fz', type: 'fillet', name: 'Т', r: 1, edges: [pick(-20, 9, 0, 9), ...R.tangentChain(T, pick(-20, 9, 0, 9))] }); R.rebuild();
    return { ch1, ch2, err: S.errors.fz || null, dv: +(R.geoVolume(S.body) - v0).toFixed(2) }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect ch1 ["circle12.5"], ch2 0 (corners at both ends), err null, dv -17.44');
  console.log(logs.join('\n')); await b.close(); })();

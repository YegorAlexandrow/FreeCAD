// A rim that runs only part way round (ARM1: the top edges of the lever along its R45 arc and round the R12 end) is
// filleted along the arc only. Taken for whole circles, these were not found at all, or the fillet ran round the
// full ring through material with no such edge (the boss rim R12.5: 16.75 mm³ instead of 13.32).
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/arm1-rolled.json', 'utf8')); doc.rollback = null;
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild(); const v0 = R.geoVolume(S.body); const T = R.edgeTopology(S.body, S.cyls); const out = {};
    for (const [k, c, rr] of [['r45', [-13.64, -45.47, 19.5], 45], ['r12', [-144, 0, 19.5], 12], ['r12_5', [0, -3.5, 19.5], 12.5]]) { const q = T.circles.find((x) => x.c.distanceTo(new x.c.constructor(...c)) < 0.01 && Math.abs(x.r - rr) < 0.01);
      S.doc.features.push({ id: 'fz', type: 'fillet', name: 'Т', r: 1, edges: [{ t: 'circle', c: q.c.toArray(), n: q.n.toArray(), r: q.r }] }); R.rebuild(); out[k] = S.errors.fz || +(R.geoVolume(S.body) - v0).toFixed(2); S.doc.features.pop(); R.rebuild(); }
    return out; }, doc);
  console.log(JSON.stringify(r)); console.log('expect r45 -6.42 (0.2146 mm² over 29.7 mm of arc), r12 -4.93, r12_5 -13.32');
  console.log(logs.join('\n')); await b.close(); })();

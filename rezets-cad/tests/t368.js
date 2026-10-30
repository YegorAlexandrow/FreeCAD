// One way of filleting every corner of an outline: on ARM1 (rolled to the end) a corner between two arcs (the lever's
// curve into the boss) and a sharp line-into-hole corner, at R3 and R10. Two arcs gave boxes before (flat faces
// assumed); a big radius in the sharp corner added material instead of taking it away.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/arm1-rolled.json', 'utf8')); doc.rollback = null;
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild(); const v0 = R.geoVolume(S.body); const T = R.edgeTopology(S.body, S.cyls);
    const at = (x, y, z) => T.lines.filter(([a, b]) => Math.abs(a.x - x) < 0.01 && Math.abs(a.y - y) < 0.01 && Math.abs(a.x - b.x) < 1e-6 && Math.abs(a.y - b.y) < 1e-6 && (z == null || Math.abs(Math.min(a.z, b.z) - z) < 0.01)).map(([a, b]) => ({ t: 'line', a: a.toArray(), b: b.toArray() }));
    const run = (edges, r) => { S.doc.features.push({ id: 'fz', type: 'fillet', name: 'Т', r, edges }); R.rebuild(); const out = S.errors.fz || +(R.geoVolume(S.body) - v0).toFixed(2); S.doc.features.pop(); R.rebuild(); return out; };
    const aa = at(-12.135, -0.5), sharp = at(-136.062, 9, 50);
    return { aa: aa.length, aa3: run(aa, 3), aa10: run(aa, 10), sharp3: run(sharp, 3), sharp10: run(sharp, 10) }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect aa 2, aa3 14.37, aa10 112.07 (added: an inside corner); sharp3 -216.68, sharp10 -700.97 (taken away, both)');
  console.log(logs.join('\n')); await b.close(); })();

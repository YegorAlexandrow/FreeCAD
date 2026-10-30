// ARM1: R30 on the two edges where the lever's straight bottom runs into its big arc. The fillet is the arc tangent to
// the straight face and to the round one, swept through the plate (it took one facet of the arc for a flat face and
// left a sliver with a spike, 55 mm³ off where it should be smooth); radii that do not fit say the largest that does.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/arm1-fillet.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); const f = S.doc.features.find((x) => x.type === 'fillet');
    f.suppressed = true; R.rebuild(); const v0 = R.geoVolume(S.body); delete f.suppressed; const out = {};
    for (const r of [30, 5]) { f.r = r; R.rebuild(); out['r' + r] = { dv: +(R.geoVolume(S.body) - v0).toFixed(1), err: S.errors[f.id] || null }; }
    // the rounded face is a cylinder of the radius, tangent to the flat bottom (y = -9) of the lever
    f.r = 30; R.rebuild(); const c = (S.cyls || []).find((q) => Math.abs(q.r - 30) < 1e-6); out.axisY = c ? +c.p.y.toFixed(3) : null;
    return out; }, doc);
  console.log(JSON.stringify(r)); console.log('expect r30 dv -33.1 no err; r5 dv -1.4; axisY 21 (30 above the bottom at y -9)');
  console.log(logs.join('\n')); await b.close(); })();

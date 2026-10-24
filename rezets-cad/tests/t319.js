// The user's ARM3: switching Бобышка1 off and on again gives back the same part. Before, while it was off, the
// sketches on it followed their references onto other geometry (a hole centre onto another hole of r 2.5) and stayed
// there: the volume went from 5441.92 to 5461.18.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/arm3-v2.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild();
    const vol = () => +R.geoVolume(S.body).toFixed(2); const v0 = vol(); const e0 = Object.keys(S.errors).join(); const sk = JSON.stringify(S.doc.features.filter((f) => f.type === 'sketch').map((f) => f.sk.pts));
    const x = S.doc.features.find((f) => f.name === 'Бобышка1'); x.suppressed = true; R.rebuild(); x.suppressed = false; R.rebuild();
    return { v0, v1: vol(), sketchesSame: sk === JSON.stringify(S.doc.features.filter((f) => f.type === 'sketch').map((f) => f.sk.pts)), errorsSame: e0 === Object.keys(S.errors).join() }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect v1 = v0, sketchesSame true, errorsSame true'); console.log(logs.join('\n')); await b.close(); })();

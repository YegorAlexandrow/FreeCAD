// The user's ARM2: Вырез6 made deeper and back gives back the same part. While deeper, the corner Эскиз9 takes a
// point from was gone and the point went to the corner 1 mm below; it now goes home again.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/arm2-chamfer.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild();
    const vol = () => +R.geoVolume(S.body).toFixed(1); const v0 = vol(); const sk = S.doc.features.find((f) => f.name === 'Эскиз9'); const w = () => JSON.stringify(Object.values(sk.sk.pts).map((q) => q.mref?.w || null));
    const w0 = w(); const cut = S.doc.features.find((f) => f.name === 'Вырез6'); const d = cut.depth; cut.depth = d * 1.5; R.rebuild(); const wMid = w(); cut.depth = d; R.rebuild();
    return { v0, v1: vol(), movedMid: wMid !== w0, back: w() === w0 }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect v1 = v0, movedMid true, back true');
  console.log(logs.join('\n')); await b.close(); })();

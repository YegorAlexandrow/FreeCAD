// The user's BASE: a dimension of Эскиз4 changed and changed back gives back the same part. While it was changed, a
// corner Эскиз14 was converted from was gone and its point jumped to a corner 148 mm away; it now goes home again.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/base-v2.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild();
    const vol = () => +R.geoVolume(S.body).toFixed(1); const v0 = vol(); const sk14 = S.doc.features.find((f) => f.name === 'Эскиз14'); const pts = () => Object.values(sk14.sk.pts).map((q) => [q.x, q.y].map((v) => +v.toFixed(3)).join(',')).join(' ');
    const p0 = pts(); const sf = S.doc.features.find((f) => f.name === 'Эскиз4'); const c = Object.values(sf.sk.cons).find((c) => c.t === 'pldist' && !c.driven && !c.expr); const v = c.v;
    c.v = v * 1.05 + 0.2; R.solveSketch(sf.sk); R.rebuild(); c.v = v; R.solveSketch(sf.sk); R.rebuild();
    return { v0, v1: vol(), same14: pts() === p0, home: Object.values(sk14.sk.pts).filter((q) => q.mref?.home).length }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect v1 = v0, same14 true, home 0');
  console.log(logs.join('\n')); await b.close(); })();

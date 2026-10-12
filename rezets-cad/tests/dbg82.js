const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm2_user3.json', 'utf8'));
(async () => {
  const { b, p, logs } = await open();
  console.log(await p.evaluate((doc) => { const R = window.__rezets; R.loadDoc(doc); const out = [];
    const fs_ = R.S.doc.features; const f21 = fs_.find((f) => f.id === 'f21');
    out.push('rb ' + R.S.doc.rollback + ' plane ' + JSON.stringify(f21.plane) + ' err ' + JSON.stringify(R.S.errors));
    const i = fs_.findIndex((f) => f.id === 'f22'); const v1 = R.geoVolume(R.computeBody(fs_.slice(0, i)).body), v2 = R.geoVolume(R.computeBody(fs_.slice(0, i + 1)).body); out.push('vol before ' + v1.toFixed(1) + ' after ' + v2.toFixed(1));
    const bb = new (R.S.body.boundingBox?.constructor || Object)(); const g = R.computeBody(fs_.slice(0, i)).body; g.computeBoundingBox(); out.push('bbox ' + JSON.stringify(g.boundingBox));
    R.setRollback(10); R.showFeatureFaces('f22'); out.push('hint ' + document.querySelector('#hint, .hint, #status')?.textContent + ' vol ' + R.geoVolume(R.S.body).toFixed(1));
    return out.join('\n'); }, doc));
  console.log(logs.join('\n')); await b.close();
})();

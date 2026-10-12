// The user's hole sketch on ARM2 (testdata/arm2_user4.json): its one centre point sits on a model circle
// centre and became that reference point; it still counts as a hole position, and the hole cuts.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm2_user4.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((d) => { const R = window.__rezets; R.loadDoc(d); const v0 = R.geoVolume(R.S.body);
    R.S.selectedTree = 'feat:f39'; R.cmdHole(); const pm = R.S.pm?.feature?.type; R.okPM();
    const h = R.S.doc.features.at(-1); return { pm, hole: h.type, std: h.std, errors: R.S.errors, cut: +(v0 - R.geoVolume(R.S.body)).toFixed(2) }; }, doc)));
  console.log('expect pm hole, hole created, no errors, cut > 0');
  console.log(logs.join('\n')); await b.close(); })();

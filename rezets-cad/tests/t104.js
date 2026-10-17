// Deleting a feature above the rollback bar keeps the bar under the same feature; so does moving one across it.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm0_user2.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc);
    const names = () => S.doc.features.slice(0, S.doc.rollback ?? 99).map((f) => f.name).join(',');
    const F = (n) => S.doc.features.find((f) => f.name === n); R.setRollback(S.doc.features.indexOf(F('Бобышка2')) + 1); const out = { before: names() };
    R.deleteFeature(F('Бобышка1')); out.afterDelete = names(); out.all = S.doc.features.map((f) => f.name).join(',');
    return out; }, doc)));
  console.log('expect before ends at Бобышка2; afterDelete Эскиз2,Бобышка2 (bar still under Бобышка2)');
  console.log(logs.join('\n')); await b.close(); })();

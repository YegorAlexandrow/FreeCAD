// The user's ARM3 sketch (testdata/arm3_user.json): the profile is defined and only the ends of a long
// construction line slide along X. Construction geometry may stay loose: the sketch reads as fully defined.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm3_user.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((d) => { const R = window.__rezets; R.loadDoc(d); const f = R.S.doc.features[0]; R.startSketch(f.plane, f);
    const a = R.analyzeSketch(f.sk); const pill = document.querySelector('#side .pill')?.textContent;
    // Freeing the profile's height must still show as under-defined.
    const c = Object.values(f.sk.cons).find((x) => x.t === 'pldist' && x.v === 5); delete f.sk.cons[c.id]; const a2 = R.analyzeSketch(f.sk);
    return { dof: a.dof, dofMain: a.dofMain, pill, afterDelete: a2.dofMain }; }, doc)));
  console.log('expect dof 2 (the construction line), dofMain 0, pill «Полностью определён»; without the 5 mm height dofMain 1');
  console.log(logs.join('\n')); await b.close(); })();

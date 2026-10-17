// ARM0's hole sketch (Эскиз4) is dimensioned to model edges brought in as reference lines; a thinner base and
// taller posts move those lines, and the holes dimensioned from them, with the model.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm0_user2.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((doc) => { const R = window.__rezets; const S = R.S;
    R.loadDoc(doc); const F = (n) => S.doc.features.find((f) => f.name === n); const pts = () => Object.fromEntries(Object.entries(F('Эскиз4').sk.pts).map(([k, q]) => [k, [+q.x.toFixed(2), +q.y.toFixed(2)]]));
    const out = { before: pts() }; F('Бобышка1').depth = 1; F('Бобышка2').depth = 14; R.rebuild();
    out.after = pts(); out.err = JSON.stringify(S.errors); out.dangling = S.dangling.get(F('Эскиз4').id);
    out.treeWarn = [...document.querySelectorAll('#side .row.err .nm')].map((x) => x.textContent);
    R.editFeature(F('Эскиз4')); out.button = [...document.querySelectorAll('#side button')].some((x) => x.textContent === 'Привязать к модели');
    R.reattachRefs(); R.exitSketch(); out.fixed = pts(); out.dangling2 = S.dangling.get(F('Эскиз4').id) || null;
    F('Бобышка2').depth = 12; R.rebuild(); out.again = pts(); return out; }, doc)));
  console.log('expect after: 9,13 at y 1; 10,14 at y 15; 17 stale from an older save: dangling [17], Эскиз4 red in the tree, a button; reattached 17 at y 15, holes 8.95; then posts at 13: 10,14,17 y 13, holes 6.95');
  console.log(logs.join('\n')); await b.close(); })();

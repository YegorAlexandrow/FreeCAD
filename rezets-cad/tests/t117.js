// The user's Деталь 6 sketch: a flat across a bore, its arc drawn the short way, so the only region is the small cap.
// «Дуга с другой стороны» turns it into the D shape.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/part6.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; doc.features = doc.features.filter((f) => f.type === 'sketch'); R.loadDoc(doc);
    const f = S.doc.features[0]; const before = R.sketchRegionsOf(f).faces.map((x) => +x.area.toFixed(2)); R.editFeature(f); S.sel = new Set(['e:11']); R.commitSketch();
    const btn = [...document.querySelectorAll('#side button')].find((x) => x.textContent === 'Дуга с другой стороны'); btn?.click(); R.exitSketch();
    return { before, button: !!btn, after: R.sketchRegionsOf(f).faces.map((x) => +x.area.toFixed(2)) }; }, doc)));
  console.log('expect before [1.84], button, after [~26.4] (pi*9 - 1.84)');
  console.log(logs.join('\n')); await b.close(); })();

// The user's gear (Деталь 2, Эскиз3): pins r 3.5 touching the bore, a model edge r 15. A fillet clicked on each
// side of the top pin adds tangent arcs closed along the bore, so the corners are regions the pin's extrude takes.
const open = require('./harness.js'); const fs = require('fs');
const sk0 = JSON.parse(fs.readFileSync(__dirname + '/../testdata/gear_sketch3.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((sk0) => { const R = window.__rezets; const S = R.S;
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [{ id: 'f6', type: 'sketch', name: 'Эскиз3', plane: R.PLANES.top, sk: sk0 }] });
    const f = S.doc.features[0]; R.editFeature(f); const sk = f.sk; const before = R.buildRegions ? 0 : 0;
    const reg0 = R.sketchRegions ? 0 : 0;
    const r1 = R.filletCurves(sk, { u: -2.2, v: 14.25 }, 1), r2 = R.filletCurves(sk, { u: 2.2, v: 14.25 }, 1); R.commitSketch(); R.exitSketch();
    const reg = window.__rezets.sketchRegionsOf(f);
    // both fillets picked, one radius typed for them
    R.editFeature(f); S.sel = new Set(['e:' + r1.arc, 'e:' + r2.arc]); R.commitSketch(); const inp = document.getElementById('skRadius'); const shown = inp?.value; inp.value = '1,5'; inp.dispatchEvent(new Event('change'));
    const radii = [sk.ents[r1.arc].r, sk.ents[r2.arc].r].map((v) => +v.toFixed(3)); R.exitSketch(); window.__radii = { shown, radii };
    return { radii: window.__radii, r1: typeof r1 === 'string' ? r1 : 'ok', r2: typeof r2 === 'string' ? r2 : 'ok', regions: reg.faces.map((x) => +x.area.toFixed(2)).sort((a, b2) => a - b2), on: reg.faces.filter((x) => x.defaultOn).map((x) => +x.area.toFixed(2)).sort((a, b2) => a - b2), dof: R.analyzeSketch(sk).dofMain }; }, sk0)));
  console.log('expect r1 r2 ok; regions: a sliver at the touch point, two corners 1.71, three pins 38.46, all on by default; radii shown 1, then [1.5,1.5]');
  console.log(logs.join('\n')); await b.close(); })();

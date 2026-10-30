// A dimension's label goes with what it measures: Деталь 12, Эскиз14's dimension to the far end of the boss moves on
// with that end when the boss gets longer (it stayed in the empty sheet, J10).
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/part12-sketch14.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild(); const F = (id) => S.doc.features.find((x) => x.id === id);
    const lab = () => { const sk = F('f42').sk; const g = R.dimGeometryOf(sk, sk.cons['44']); return [+g.label.x.toFixed(3), +g.label.y.toFixed(3)]; };
    const a = lab(); const f = F('f35'); R.editFeature(f); f.sk.cons['190'].v = 32; R.solveSketch(f.sk); R.commitSketch(); R.exitSketch(); const b = lab();
    return { moved: [+(b[0] - a[0]).toFixed(3), +(b[1] - a[1]).toFixed(3)] }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect moved [-2,0] (the far end moved 2 mm along the sketch x)');
  console.log(logs.join('\n')); await b.close(); })();

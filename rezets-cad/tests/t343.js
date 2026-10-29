// Деталь 12, Эскиз8: arcs drawn over the reference circles (one and the same circle, tied by a tangent point) made one
// row of the solver a million times steeper than the rest; the dimension 4.08 could not be set to 3 («недостижимо»).
// And the end of a line on another line (a T) was counted as a free end: «Контур не замкнут» on a closed profile.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/part12-sketch8.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild(); const f = S.doc.features.find((x) => x.name === 'Эскиз8'); R.editFeature(f);
    const open = [...document.querySelectorAll('.note')].some((t) => /не замкнут/.test(t.textContent)); const c = f.sk.cons['59']; c.v = 3; const ok = R.solveSketch(f.sk);
    return { open, ok, x: +f.sk.pts['50'].x.toFixed(4), fixedStay: [f.sk.pts['48'].x, f.sk.pts['48'].y].map((v) => +v.toFixed(4)) }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect open false, ok true, x 7, fixedStay [4,-1]');
  console.log(logs.join('\n')); await b.close(); })();

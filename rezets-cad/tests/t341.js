// Деталь 12: the diameter of the ends in Эскиз4 from 3.5 to 4 and back. Эскиз5, traced on that outline, follows the
// corners to their new places (each 0.25 to 0.5 mm off), loses nothing, and comes back exactly when the change is undone.
// Before, a corner at (3.5; 0) went to (16.5; 25), a corner that only looked the same, and stayed there afterwards.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/part12-gap.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild(); const F = (n) => S.doc.features.find((x) => x.name === n);
    const pts = () => Object.fromEntries(Object.values(F('Эскиз5').sk.pts).map((q) => [q.id, [q.x, q.y]]));
    const p0 = pts(); const s4 = F('Эскиз4').sk; s4.cons['3'].v = 4; R.solveSketch(s4); R.rebuild(); const p1 = pts();
    const jump = Math.max(...Object.keys(p0).map((k) => Math.hypot(p1[k][0] - p0[k][0], p1[k][1] - p0[k][1])));
    const lost = [...S.dangling.values()].flat().length;
    s4.cons['3'].v = 3.5; R.solveSketch(s4); R.rebuild(); const p2 = pts();
    const back = Math.max(...Object.keys(p0).map((k) => Math.hypot(p2[k][0] - p0[k][0], p2[k][1] - p0[k][1])));
    return { p66: p1['66'].map((v) => +v.toFixed(3)), jump: +jump.toFixed(3), lost, back: +back.toExponential(1) }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect p66 [4,0], jump about 0.5, lost 0, back below 1e-4 (the solver tolerance)');
  console.log(logs.join('\n')); await b.close(); })();

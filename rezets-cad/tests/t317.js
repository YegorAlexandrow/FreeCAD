// The user's BASE: widening the cut of Эскиз10 shortens an edge of Скругление2. The fillet stays on that line (it jumped
// to an edge of the same length 148 mm away before), and undoing the change gives the edge its old ends back.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/base-v2.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild();
    const f = S.doc.features.find((x) => x.name === 'Скругление2'); const sf = S.doc.features.find((x) => x.name === 'Эскиз10');
    const ends = () => f.edges.map((e) => [...e.a, ...e.b].map((v) => +v.toFixed(2)).join(' '));
    const c = Object.values(sf.sk.cons).find((c) => c.t === 'pldist' && !c.driven && !c.expr); const v0 = c.v; const e0 = ends();
    c.v = v0 * 1.03 + 0.1; R.solveSketch(sf.sk); R.rebuild(); const e1 = ends(); const err1 = S.errors[f.id] || null;
    c.v = v0; R.solveSketch(sf.sk); R.rebuild(); return { e0, e1, err1, back: JSON.stringify(ends()) === JSON.stringify(e0), err2: S.errors[f.id] || null }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect e1[0] on z -22 ending at -13.44, err null, back true');
  console.log(logs.join('\n')); await b.close(); })();

// The user's ARM2: shifting the sketch of a hole (Эскиз13) keeps the chamfer on its rim (it lost its edge before:
// the rim only knew its axis, now it knows the operation that made the hole).
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/arm2-chamfer.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild();
    const sf = S.doc.features.find((f) => f.name === 'Эскиз13'); const ch = S.doc.features.find((f) => f.name === 'Фаска2');
    const free = Object.values(sf.sk.pts).filter((q) => !q.fixed && !q.ext); for (const q of free) q.x += 1.5; R.solveSketch(sf.sk); R.rebuild();
    return { err: S.errors[ch.id] || null, src: ch.edges[0].src || null, c: ch.edges[0].c.map((v) => +v.toFixed(2)) }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect err null, src set, c moved by 1.5 in x from [19.91,0,3]');
  console.log(logs.join('\n')); await b.close(); })();

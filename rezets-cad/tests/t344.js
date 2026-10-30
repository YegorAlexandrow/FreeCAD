// Деталь 12, Эскиз14 on the side of a boss whose length is a dimension of Эскиз11 (19.2 then 30). A source was given
// only when every reference point of a sketch sat on its corner: one point off kept all four without, the corners
// moved 10.8 mm, more than a search may jump, and all four were left hanging. Each point is now tied on its own.
// A point whose source point was deleted in the earlier sketch, while its corner stays, is tied again.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/part12-sketch14.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild(); const F = (id) => S.doc.features.find((x) => x.id === id);
    const setDim = (v) => { const f = F('f35'); R.editFeature(f); f.sk.cons['190'].v = v; R.solveSketch(f.sk); R.commitSketch(); R.exitSketch(); };
    const st = () => ['41', '45'].map((k) => { const q = F('f42').sk.pts[k]; return +q.x.toFixed(3) + (q.lost ? ' lost' : ''); }).join(' ');
    setDim(19.2); const s14 = F('f42').sk;
    for (const k of ['41', '42', '45', '48']) { const m = s14.pts[k].mref; delete m.from; delete m.nosrc; }
    // A reference point away from any corner, as one left by an earlier change.
    s14.pts['90'] = { id: '90', x: -10, y: 6, fixed: true, free: true, lost: true, mref: { w: [18.499998, 6, 10], ns: [[1, 0, 0]] } };
    R.rebuild(); setDim(30); const a = st(); setDim(19.2); const back = st();
    // The source of the corner of Эскиз11 at the boss is deleted and drawn again under another id.
    const s11 = F('f35').sk; const q = s11.pts['263']; s11.pts['999'] = { ...q, id: '999' }; for (const e of Object.values(s11.ents)) for (const k of ['p1', 'p2']) if (e[k] === '263') e[k] = '999'; for (const c of Object.values(s11.cons)) c.refs = c.refs.map((x) => (x === '263' ? '999' : x)); delete s11.pts['263']; R.rebuild();
    return { a, back, retied: st(), src: F('f42').sk.pts['41'].mref.from?.pt }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect a "-33.45 -3.45", back "-22.65 -3.45", retied "-22.65 -3.45", src "999"');
  console.log(logs.join('\n')); await b.close(); })();

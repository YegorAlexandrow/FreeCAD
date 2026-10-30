// The user's BASE Эскиз6 (a pattern of 8 hinge outlines, ~360 points): everything selected and mirrored about the
// long diagonal construction line. It froze the page; now it must finish in seconds, pick the diagonal as the axis,
// and leave the sketch without red (redundant) relations.
const open = require('./harness.js'); const fs = require('fs');
(async () => { const { b, p, logs } = await open();
  const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/base_d30b.json', 'utf8')).data;
  const out = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); const f = S.doc.features.find((x) => x.id === 'f22');
    let t = performance.now(); R.editFeature(f); const tEnter = performance.now() - t; const sk = f.sk; const n0 = Object.keys(sk.ents).length;
    t = performance.now(); const a0 = R.analyzeSketch(sk); const tAn = performance.now() - t;
    S.sel.clear(); for (const id of Object.keys(sk.ents)) S.sel.add('e:' + id);
    t = performance.now(); R.cmdMirror(); R.okMirror(); const tMirror = performance.now() - t;
    const a = R.analyzeSketch(sk); const axisLike = Object.values(sk.cons).filter((c) => c.t === 'symmetric').map((c) => c.refs[2]);
    const red = [...a.redundant].map((cid) => [cid, sk.cons[cid]?.t, (sk.cons[cid]?.refs || []).map((r) => sk.ents[r]?.t || 'p').join(), [...(a.repeats.get(cid) || [])].map((x) => sk.cons[x]?.t || x).join()]); return { red, tEnter: Math.round(tEnter), tAn: Math.round(tAn), dof0: a0.dof, tMirror: Math.round(tMirror), ents: [n0, Object.keys(sk.ents).length], axes: [...new Set(axisLike)], redundant: a.redundant.size, dof: a.dof, err: JSON.stringify(S.errors) }; }, doc);
  console.log(JSON.stringify(out));
  console.log('expect tMirror a few seconds at most, ents almost doubled, symmetric axis 668 (the diagonal) besides earlier ones, redundant 0');
  console.log(logs.join('\n')); await b.close(); })();

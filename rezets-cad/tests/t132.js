// The user's gripper Эскиз1: underdefined with 5 DOF, yet nothing can be dragged and dimensions are refused.
const open = require('./harness.js'); const fs = require('fs');
(async () => { const { b, p, logs } = await open();
  const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/gripper2.json', 'utf8')).data;
  console.log(JSON.stringify(await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.editFeature(S.doc.features[0]);
    const sk = R.featById(S.editing).sk; const a = R.analyzeSketch(sk); const out = { dof: a.dof, explain: R.explainFree(sk, a).map((x) => JSON.stringify(x).slice(0, 160)).slice(0, 8) };
    const tries = { len130: { t: 'dist', refs: ['127', '1'], v: 6 }, dy1: { t: 'dy', refs: ['O', '1'], v: 0 }, dy5: { t: 'dy', refs: ['O', '5'], v: 25 }, dy48: { t: 'dy', refs: ['O', '48'], v: 1 } };
    out.tries = {}; for (const [k, c] of Object.entries(tries)) { const r = R.tryAddConstraint(sk, { id: 'tt' + k, ...c }); out.tries[k] = r === true || r?.ok ? 'ok' : JSON.stringify(r).slice(0, 200); if (sk.cons['tt' + k]) delete sk.cons['tt' + k]; }
    return out; }, doc)));
  console.log(logs.join('\n')); await b.close(); })();

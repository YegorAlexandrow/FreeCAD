// The user's ARM2 with a boss drawn exactly over the first one (offset 0): no error, no 8 s stall.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm2_user2.json', 'utf8'));
(async () => {
  const { b, p, logs } = await open();
  console.log(await p.evaluate((doc) => { const R = window.__rezets; R.loadDoc(doc); const out = ['load ' + JSON.stringify(R.S.errors)];
    const f = R.S.doc.features.find((x) => x.id === 'f17'); for (const off of [30, 0, 5]) { f.fromOffset = off; const t0 = performance.now(); R.rebuild(); out.push('rebuild ms ' + Math.round(performance.now() - t0)); out.push('offset ' + off + ' ' + JSON.stringify(R.S.errors) + ' vol ' + R.geoVolume(R.S.body).toFixed(2) + (window.__stk ? ' STACK ' + window.__stk.split('\n').slice(0, 6).join(' / ') : '')); window.__stk = null; }
    try { const r = R.computeBody(R.S.doc.features); out.push('cb ' + JSON.stringify(r.errors)); } catch (e) { out.push('throw ' + e.stack.split('\n').slice(0, 4).join(' | ')); }
    return out.join('\n'); }, doc));
  console.log(logs.join('\n')); await b.close();
})();

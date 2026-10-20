const open = require('./harness.js'); const fs = require('fs');
(async () => { const { b, p, logs } = await open();
  const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/gripper2.json', 'utf8')).data;
  console.log(JSON.stringify(await p.evaluate((doc) => { const R = window.__rezets; R.loadDoc(doc); const sk = doc.features[0].sk; R.collapseZeroLines(sk);
    const res = {};
    for (const [id, dy] of [['1', 0.5], ['48', 0.5], ['5', 0.5]]) {
      const s2 = JSON.parse(JSON.stringify(sk)); s2.pts[id].y += dy; const sys = R.buildSystem(s2); const X = Float64Array.from(sys.X); const i = sys.idx['p' + id];
      const ok = R.solveSystem(sys, X, [[i, 1e-4], [i + 1, 1e-4]]); const bad = []; for (const e of sys.eqs) { const m = Math.max(...e.f(X).map(Math.abs)); if (m > 1e-7) bad.push([e.cid, s2.cons[e.cid]?.t || '', +m.toExponential(2)]); }
      res[id] = { ok, y: X[i + 1], bad: bad.slice(0, 8) };
    }
    return res; }, doc)));
  console.log(logs.join('\n')); await b.close(); })();

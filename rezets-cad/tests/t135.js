const open = require('./harness.js'); const fs = require('fs');
(async () => { const { b, p, logs } = await open();
  const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/gripper2.json', 'utf8')).data;
  console.log(JSON.stringify(await p.evaluate((doc) => { const R = window.__rezets; R.loadDoc(doc); const sk = doc.features[0].sk;
    const sys = R.buildSystem(sk); const X = Float64Array.from(sys.X); const rows = R.jacobian(sys, X); const { dependent } = R.eliminate(rows, X.length);
    return dependent.map((d) => [rows[d.ri].cid, [...d.comb.entries()].filter(([, v]) => Math.abs(v) > 1e-6).map(([k]) => rows[k].cid)]); }, doc)));
  console.log(logs.join('\n')); await b.close(); })();

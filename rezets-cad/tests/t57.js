// Interference on the user's servo assembly (testdata/big/servo_proj3.json, not in git): must take well under a second.
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/servo_proj3.json', 'utf8');
(async () => {
  const { b, p } = await open();
  console.log(await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d2');
    window.__bl = []; const t = performance.now(); const res = R.asmInterference(R.S.doc); return ['ms', Math.round(performance.now() - t), JSON.stringify(res.map((r) => [r.a, r.b, r.vol.toFixed(2)]))].join(' '); }, proj));
  await b.close();
})();

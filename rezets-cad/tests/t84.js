// Interference on the user's latest servo assembly (testdata/big/servo_proj9.json, not in git): pairs that
// cannot touch are skipped, the check runs pair by pair with progress, and the window stays responsive.
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/servo_proj9.json', 'utf8');
(async () => { const { b, p, logs } = await open();
  await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d2'); window.__t0 = performance.now(); R.cmdInterference(); }, proj);
  const progress = []; for (let i = 0; i < 400; i++) { const t = Date.now(); const x = await p.evaluate(() => { const pm = window.__rezets.S.pm; return pm?.busy ? pm.busy.done + '/' + pm.busy.of : 'done'; }); progress.push([x, Date.now() - t]); if (x === 'done') break; await p.waitForTimeout(100); }
  const res = await p.evaluate(() => ({ ms: Math.round(performance.now() - window.__t0), res: window.__rezets.S.pm.res.map((r) => [r.a, r.b, +r.vol.toFixed(1)]), text: document.querySelector('#side .grp')?.textContent }));
  const seen = [...new Set(progress.map((x) => x[0]))];
  console.log(JSON.stringify({ seen, maxAnswerMs: Math.max(...progress.map((x) => x[1])), ...res }));
  console.log('expect progress 0/6 … 6/6, done; c1-c17 (0.004 mm³) not listed, c17-c21 ≈ 20.4, c17-c26 ≈ 67.9');
  console.log(logs.join('\n')); await b.close(); })();

// Interference on the user's servo assembly (testdata/big/servo_proj4.json, not in git): fast, exact
// for the horn screw head pressed 0.6 mm into the plate, and the result stays drawn while hovering.
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/servo_proj4.json', 'utf8');
(async () => {
  const { b, p } = await open();
  console.log(await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d2');
    const t = performance.now(); const res = R.asmInterference(R.S.doc);
    return ['ms ' + Math.round(performance.now() - t), ...res.map((r) => [r.a, r.b, r.vol.toFixed(3)].join(' ')), 'screw head exact ' + (Math.PI * 2.9 * 2.9 * 0.6).toFixed(3)].join('\n'); }, proj));
  await p.click('[data-view="iso"]'); await p.waitForTimeout(300); await p.keyboard.press('f'); await p.waitForTimeout(300);
  await p.evaluate(() => window.__rezets.cmdInterference()); await p.waitForTimeout(300);
  const n0 = await p.evaluate(() => window.__rezets.groups.measure.children.length);
  for (let i = 0; i < 20; i++) { await p.mouse.move(400 + i * 40, 300 + i * 15); await p.waitForTimeout(40); }
  console.log('drawn before/after hovering', n0, await p.evaluate(() => window.__rezets.groups.measure.children.length));
  await p.evaluate(() => { const R = window.__rezets; const pm = R.S.pm; pm.sel = 0; });
  await p.click('[data-view="top"]'); await p.waitForTimeout(600); await p.screenshot({ path: 's57.png' });
  await b.close();
})();

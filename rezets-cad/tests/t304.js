// The feature tree folds out under a property panel: a mirror takes its plane from it, a pattern its features.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.S.selectedTree = null; R.cmdPattern('mirror'); }); await p.waitForTimeout(300);
  await p.click('#side details.flytree summary'); await p.waitForTimeout(150);
  const rows = await p.evaluate(() => [...document.querySelectorAll('#side .flytree .row')].map((r) => r.textContent));
  await p.click('#side .flytree .row >> text=Справа'); await p.waitForTimeout(200);
  const plane = await p.evaluate(() => JSON.stringify(window.__rezets.S.pm.feature.plane));
  const featName = rows.find((x) => !['Спереди', 'Сверху', 'Справа'].includes(x)); await p.click(`#side .flytree .row >> text=${featName}`); await p.waitForTimeout(300);
  const feats = await p.evaluate(() => window.__rezets.S.pm.feature.feats.map((id) => window.__rezets.featById(id).name));
  console.log(JSON.stringify({ rows, plane, feats })); console.log('expect rows the three planes and the features, plane {std:right}, feats [the first feature]');
  console.log(logs.join('\n')); await b.close(); })();

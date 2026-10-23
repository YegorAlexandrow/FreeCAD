// The BASE part broken by a hole drag before v105 shows «Починить BASE»; the button puts Бобышка5 back on the four
// rings and Бобышка14 on the four discs, can be undone, and the bar is gone once it is fixed.
const open = require('./harness.js'); const fs = require('fs');
const src = JSON.parse(fs.readFileSync(__dirname + '/data/base-broken.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const st = () => p.evaluate(() => { const R = window.__rezets; const S = R.S; const bar = document.getElementById('repairBar');
    return { bar: !bar.hidden, regions: ['f18', 'f70'].map((id) => R.featById(id).regions), vol: Math.round(R.geoVolume(S.body)), err: Object.keys(S.errors).length }; });
  await p.evaluate((d) => window.__rezets.loadDoc(d), src); await p.waitForTimeout(300); const before = await st();
  await p.click('#repairBar button'); await p.waitForTimeout(500); const fixed = await st();
  await p.evaluate(() => window.__rezets.undo()); await p.waitForTimeout(300); const undone = await st();
  console.log(JSON.stringify({ before, fixed, undone }));
  console.log('expect before bar true regions [[3],[3]] vol 317903; fixed bar false regions [[8,9,10,11],[4,5,6,7]] vol 133691 err 0; undone like before');
  console.log(logs.join('\n')); await b.close(); })();

// Mirror and patterns: features are picked by clicking one of their faces in the window; faces of the
// preview copies are not taken for the last feature.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm2_user5_1uw.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  await p.evaluate((d) => { const R = window.__rezets; R.loadDoc(d); R.S.selectedTree = null; R.cmdPattern('lpattern'); }, doc);
  const st = await p.evaluate(() => ({ pickFor: window.__rezets.S.pm.pickFor, feats: window.__rezets.S.pm.feature.feats.slice() }));
  const find = () => p.evaluate(() => { const R = window.__rezets; const r = document.getElementById('cv').getBoundingClientRect(); const steps = R.solidSteps();
    for (let y = r.top + 30; y < r.bottom - 30; y += 15) for (let x = r.left + 30; x < r.right - 30; x += 15) { const q = R.partPickAt({ clientX: x, clientY: y }); if (q?.face && R.faceCreator({ ...q.face, creator: undefined }, steps) === 'f29') return { x, y }; } return null; });
  const xy = await find(); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(300); const afterClick = await p.evaluate(() => window.__rezets.S.pm.feature.feats.slice());
  await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(300); const again = await p.evaluate(() => window.__rezets.S.pm.feature.feats.slice());
  console.log(JSON.stringify({ st, at: !!xy, afterClick, again })); console.log('expect pickFor feats, a face of Вырез6 found, afterClick adds f29 to the seed f44, again unchanged (that spot is now a preview copy face)');
  console.log(logs.join('\n')); await b.close(); })();

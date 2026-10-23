// Mirror and patterns: features are picked by clicking one of their faces in the window; faces of the
// preview copies are not taken for the last feature.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm2_user5_1uw.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  await p.evaluate((d) => { const R = window.__rezets; R.loadDoc(d); R.S.selectedTree = null; R.cmdPattern('lpattern'); }, doc);
  const st = await p.evaluate(() => ({ pickFor: window.__rezets.S.pm.pickFor, feats: window.__rezets.S.pm.feature.feats.slice() }));
  const find = () => p.evaluate(() => { const R = window.__rezets; const r = document.getElementById('cv').getBoundingClientRect(); const steps = R.solidSteps(); let best = null;
    for (let y = r.top + 30; y < r.bottom - 30; y += 8) for (let x = r.left + 30; x < r.right - 30; x += 8) { const q = R.partPickAt({ clientX: x, clientY: y }); if (q?.face && R.faceCreator({ ...q.face, creator: undefined }, steps) === 'f29') { const d = R.pickEdge({ clientX: x, clientY: y }, R.S.pm.topo, true)?.pd ?? 99; if (!best || d > best.d) best = { x, y, d }; } } return best; });
  const xy = await find(); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(300); const afterClick = await p.evaluate(() => window.__rezets.S.pm.feature.feats.slice());
  await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(300); const again = await p.evaluate(() => window.__rezets.S.pm.feature.feats.slice());
  console.log(JSON.stringify({ st, at: !!xy, afterClick, again })); console.log('expect pickFor feats, a face of Вырез6 found, afterClick adds the clicked feature to the seed f44 (the spot farthest from edges, since a click on an edge now sets the direction), again unchanged (that spot is now a preview copy face)');
  console.log(logs.join('\n')); await b.close(); })();

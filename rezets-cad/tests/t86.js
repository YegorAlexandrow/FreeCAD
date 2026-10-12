// Mirror: the plane box switches the window clicks to the mirror plane; a face picked there becomes it,
// and the copies of Бобышка7 and Вырез8 land across it (the user's ARM2, testdata/arm2_user5_m66.json).
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm2_user5_m66.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  await p.evaluate((d) => { const R = window.__rezets; R.loadDoc(d); R.S.selectedTree = 'feat:f42'; R.cmdPattern('mirror'); R.S.pm.feature.feats.push('f45'); }, doc);
  const before = await p.evaluate(() => window.__rezets.S.pm.pickFor);
  const boxes = await p.$$('#side .pickbox'); for (const bx of boxes) if ((await bx.textContent()).includes('Справа')) { await bx.click(); break; }
  const after = await p.evaluate(() => window.__rezets.S.pm.pickFor);
  const xy = await p.evaluate(() => { const R = window.__rezets; const r = document.getElementById('cv').getBoundingClientRect(); for (let y = r.top + 30; y < r.bottom - 30; y += 15) for (let x = r.left + 30; x < r.right - 30; x += 15) { const q = R.partPickAt({ clientX: x, clientY: y }); if (q?.face && !q.face.cyl) return { x, y }; } return null; });
  await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(300);
  const plane = await p.evaluate(() => { const f = window.__rezets.S.pm.feature; return f.plane.face ? 'face n ' + f.plane.face.n.map((v) => +v.toFixed(2)) : JSON.stringify(f.plane); });
  // Mirror across the middle of the two plates (z = 1.5 and z = -28.5 → z = -13.5): Бобышка7 moves to the top plate.
  const vol = await p.evaluate(() => { const R = window.__rezets; const f = R.S.pm.feature; f.plane = { face: { o: [0, 0, -13.5], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] } }; R.okPM(); return { err: R.S.errors, feats: R.S.doc.features.at(-1).feats }; });
  console.log(JSON.stringify({ before, after, plane, vol })); console.log('expect before feats, after plane, a face picked as the mirror plane, mirror made with f42,f45 and no errors');
  console.log(logs.join('\n')); await b.close(); })();

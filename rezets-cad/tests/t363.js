// P0-46: a middle click on the model makes the point under it the centre the view turns about; the picture stays.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1200);
  const box = await (await p.$('#cv')).boundingBox();
  const before = await p.evaluate(() => window.__rezets.camInfo().map((v) => +v.toFixed(3)));
  // the sample part fills the middle of the view
  const pt = await p.evaluate(() => { const R = window.__rezets; const cv = document.getElementById('cv').getBoundingClientRect(); for (let y = 0.45; y < 0.7; y += 0.02) for (let x = 0.4; x < 0.6; x += 0.02) { const s = { x: cv.left + cv.width * x, y: cv.top + cv.height * y }; if (R.partPickAt({ clientX: s.x, clientY: s.y })?.face) return s; } return null; });
  await p.mouse.move(pt.x, pt.y); await p.mouse.down({ button: 'middle' }); await p.mouse.up({ button: 'middle' }); await p.waitForTimeout(500);
  const after = await p.evaluate(() => window.__rezets.camInfo().map((v) => +v.toFixed(3)));
  const d = [0, 1, 2].map((i) => +(after[i] - before[i]).toFixed(3)), dt = [3, 4, 5].map((i) => +(after[i] - before[i]).toFixed(3));
  console.log(JSON.stringify({ moved: d.some((v) => v !== 0), sameShift: JSON.stringify(d) === JSON.stringify(dt), zoom: after[6] === before[6] }));
  console.log('expect moved true, sameShift true (camera and target moved together), zoom true');
  console.log(logs.join('\n')); await b.close(); })();

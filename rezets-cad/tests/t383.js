// P0-21: a double click on a face of the part opens the operation that made it, the depth field in focus.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1200);
  const pt = await p.evaluate(() => { const R = window.__rezets; const cv = document.getElementById('cv').getBoundingClientRect(); for (let y = 0.3; y < 0.8; y += 0.02) for (let x = 0.3; x < 0.7; x += 0.02) { const s = { clientX: cv.left + cv.width * x, clientY: cv.top + cv.height * y }; const q = R.partPickAt(s); if (q?.face && !q.face.cyl) return [s.clientX, s.clientY]; } return null; });
  await p.mouse.dblclick(...pt); await p.waitForTimeout(400);
  const r = await p.evaluate(() => ({ pm: window.__rezets.S.pm?.feature?.type || null, focus: document.activeElement?.id || '' }));
  console.log(JSON.stringify(r)); console.log('expect pm extrude, focus pmDepth'); console.log(logs.join('\n')); await b.close(); })();

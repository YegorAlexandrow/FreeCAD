// P0-22: Shift+F fits the view to what is selected (a face or an edge: zooms in), Backspace goes back to the view before.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1500);
  const z0 = await p.evaluate(() => window.__rezets.camInfo()[6]);
  // the smallest flat face in view (the top of the boss)
  const pt = await p.evaluate(() => { const R = window.__rezets; const cv = document.getElementById('cv').getBoundingClientRect(); let best = null; for (let y = 0.3; y < 0.8; y += 0.01) for (let x = 0.3; x < 0.7; x += 0.01) { const s = { clientX: cv.left + cv.width * x, clientY: cv.top + cv.height * y }; const q = R.partPickAt(s); if (q?.face && !q.face.cyl && (!best || q.face.area < best.a)) best = { a: q.face.area, p: [s.clientX, s.clientY] }; } return best.p; });
  await p.mouse.click(...pt); await p.waitForTimeout(300); await p.keyboard.press('Shift+F'); await p.waitForTimeout(600); const z1 = await p.evaluate(() => window.__rezets.camInfo()[6]);
  await p.keyboard.press('Backspace'); await p.waitForTimeout(300); const z2 = await p.evaluate(() => window.__rezets.camInfo()[6]);
  console.log(JSON.stringify({ zoomedIn: z1 > z0 * 1.05, back: Math.abs(z2 - z0) < 1e-6 * Math.max(1, z0) })); console.log('expect zoomedIn true, back true'); console.log(logs.join('\n')); await b.close(); })();

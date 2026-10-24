// Clicking again on the same spot selects the next face along the ray (P0-25): the first face hit in the sample part,
// then the ones under it; moving away starts from the front face again.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc(R.sampleDoc()); R.rebuild(); });
  await p.click('text=Сверху'); await p.waitForTimeout(900);
  const cv = await p.$('#cv'); const bb = await cv.boundingBox(); const x = bb.x + bb.width / 2, y = bb.y + bb.height / 2;
  const sel = () => p.evaluate(() => { const S = window.__rezets.S; const f = S.pickedFace; return (f ? [f.o, f.n].map((v) => v.map((q) => +q.toFixed(2)).join(',')).join(' n ') : 'cyl') + ' | ' + document.getElementById('hint').textContent.slice(0, 50); });
  const out = [];
  for (let i = 0; i < 3; i++) { await p.mouse.click(x, y); await p.waitForTimeout(600); out.push(await sel()); }
  await p.mouse.click(x + 40, y); await p.waitForTimeout(600); await p.mouse.click(x, y); await p.waitForTimeout(600); out.push(await sel());
  console.log(JSON.stringify(out)); console.log('expect out[0], out[1], out[2] three different faces along the ray (⌀44, ⌀24, the bottom), out[3] = out[0]');
  console.log(logs.join('\n')); await b.close(); })();

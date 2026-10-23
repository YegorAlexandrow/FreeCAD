// G11: a 200x10x10 bar seen end-on fills the window by its 10 mm section, not by its 100 mm half-length sphere.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(10, 0), P(10, 10), P(0, 10)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 200, dir: 1, regions: null }] }); });
  await p.mouse.move(700, 400); await p.keyboard.press('Control+1'); await p.waitForTimeout(600); await p.keyboard.press('f'); await p.waitForTimeout(1200);
  const front = await p.evaluate(() => window.__rezets.camInfo().map(v => +v.toFixed(2)));
  await p.keyboard.press('Control+7'); await p.waitForTimeout(600); await p.keyboard.press('f'); await p.waitForTimeout(1200);
  const iso = await p.evaluate(() => window.__rezets.camInfo().map(v => +v.toFixed(2)));
  console.log(JSON.stringify({ frontZoom: front[6], frontTarget: front.slice(3, 6), isoZoom: iso[6], isoTarget: iso.slice(3, 6) }));
  console.log('expect frontZoom ≈ 26 (was ≈ 1.27), target ≈ [5,5,100]; isoZoom larger than the sphere fit 1.27');
  await p.screenshot({ path: process.env.SHOT || '/dev/null' }).catch(() => {});
  console.log(logs.join('\n')); await b.close(); })();

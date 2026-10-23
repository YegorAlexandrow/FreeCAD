// G8: a standard view turns and fits in one motion (zoom changes during the turn, no second jump after).
// G10: «Перпендикулярно» on a plane seen from behind squares it up from that side, without a half turn.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(200, 0), P(200, 20), P(0, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 20, dir: 1, regions: null }] }); });
  const cam = () => p.evaluate(() => window.__rezets.camInfo().map(v => +v.toFixed(3)));
  await p.mouse.move(700, 450); await p.keyboard.press('Control+7'); await p.waitForTimeout(600);
  const z0 = (await cam())[6];
  await p.keyboard.press('Control+5'); await p.waitForTimeout(110); const mid = (await cam())[6]; await p.waitForTimeout(500); const end = (await cam())[6];
  await p.keyboard.press('f'); await p.waitForTimeout(300); const refit = (await cam())[6];
  console.log('G8', JSON.stringify({ z0, mid, end, refit }), 'expect mid strictly between z0 and end, refit = end');
  await p.keyboard.press('Control+2'); await p.waitForTimeout(600); await p.mouse.move(1200, 750); await p.mouse.down(); for (let i = 1; i <= 5; i++) await p.mouse.move(1200 + i * 10, 750 + i * 6); await p.mouse.up(); await p.waitForTimeout(200);
  await p.evaluate(() => { const R = window.__rezets; R.S.selectedTree = 'plane:front'; });
await p.keyboard.press('Control+8'); await p.waitForTimeout(600); const c = await cam();
  const look = [c[0] - c[3], c[1] - c[4], c[2] - c[5]]; const n = Math.hypot(...look);
  console.log('G10', JSON.stringify({ lookZ: +(look[2] / n).toFixed(3) }), 'expect lookZ -1 (stays on the back side)');
  console.log(logs.join('\n')); await b.close(); })();

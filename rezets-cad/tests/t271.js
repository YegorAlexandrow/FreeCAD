// G7: after zooming at the cursor, a drag turns about the point of the part it starts on: that point stays under the cursor.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(-40, -40), P(40, -40), P(40, 40), P(-40, 40)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 20, dir: 1, regions: null }] }); });
  await p.mouse.move(700, 450); await p.keyboard.press('f'); await p.waitForTimeout(500);
  const box = await p.evaluate(() => { const r = document.querySelector('canvas').getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
  const at = [box[0] + box[2] * 0.62, box[1] + box[3] * 0.6];
  await p.mouse.move(at[0], at[1]); for (let i = 0; i < 4; i++) { await p.mouse.wheel(0, -200); await p.waitForTimeout(120); }
  const hit = () => p.evaluate(([x, y]) => { const h = window.__rezets.partPickAt({ clientX: x, clientY: y }, true); return h && h.point ? [h.point.x, h.point.y, h.point.z].map((v) => +v.toFixed(2)) : null; }, at);
  const before = await hit();
  await p.mouse.move(at[0], at[1]); await p.mouse.down(); for (let i = 1; i <= 10; i++) await p.mouse.move(at[0] + i * 8, at[1] + i * 3); await p.mouse.up(); await p.waitForTimeout(300);
  const after = await hit();
  const d = before && after ? +Math.hypot(...before.map((v, i) => v - after[i])).toFixed(2) : null;
  console.log(JSON.stringify({ before, after, d }));
  console.log('expect d ≈ 0 (the grabbed point stays under the cursor; before the fix it slid by tens of mm)');
  console.log(logs.join('\n')); await b.close(); })();

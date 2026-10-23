// View cube: it turns with the view; a click on a face, an edge or a corner turns the view to that direction; a
// drag on it turns the view.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(-30, -20), P(30, -20), P(30, 20), P(-30, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 15, dir: 1, regions: null }] }); });
  const look = () => p.evaluate(() => { const c = window.__rezets.camInfo(); const d = [c[0] - c[3], c[1] - c[4], c[2] - c[5]]; const n = Math.hypot(...d); return d.map((v) => +(v / n).toFixed(3)); });
  const box = await p.evaluate(() => { const r = document.getElementById('viewCube').getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
  const cx = box[0] + box[2] / 2, cy = box[1] + box[3] / 2;
  await p.mouse.move(700, 450); await p.keyboard.press('Control+1'); await p.waitForTimeout(600);
  // Seen from the front, the middle of the cube is the front face, its right band the front right edge, its top band
  // the front top edge.
  await p.mouse.click(cx + 28, cy); await p.waitForTimeout(600); const right = await look();
  await p.keyboard.press('Control+1'); await p.waitForTimeout(600); await p.mouse.click(cx, cy - 28); await p.waitForTimeout(600); const edge = await look();
  await p.keyboard.press('Control+7'); await p.waitForTimeout(600); const iso = await look();
  await p.mouse.move(cx, cy); await p.mouse.down(); for (let i = 1; i <= 8; i++) await p.mouse.move(cx + i * 4, cy); await p.mouse.up(); await p.waitForTimeout(300); const dragged = await look();
  await p.mouse.click(cx, cy); await p.waitForTimeout(600); const face = await look();
  await p.keyboard.press('Control+7'); await p.waitForTimeout(600); await p.mouse.click(cx, cy); await p.waitForTimeout(600); const corner = await look();
  console.log(JSON.stringify({ right, edge, iso, dragged, face, corner, size: box.slice(2) }));
  console.log('expect right [0.707,0,0.707]; edge [0,0.707,0.707]; dragged differs from iso; face an axis; corner [0.577,0.577,0.577]');
  await p.mouse.move(cx + 30, cy - 15); await p.waitForTimeout(300); await p.screenshot({ path: process.env.SHOT || '/dev/null', clip: { x: box[0] - 300, y: box[1], width: box[2] + 300, height: box[3] + 200 } }).catch(() => {});
  console.log(logs.join('\n')); await b.close(); })();

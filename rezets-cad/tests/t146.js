// Extrusion depth dragged by the arrow on the model: the depth follows the mouse along the sketch normal, the field
// shows it, dragging back through the sketch turns the boss the other way, Esc during the drag puts it back.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1500); const out = {};
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; S.selectedTree = 'feat:' + S.doc.features.find((f) => f.type === 'sketch').id; R.cmdFeature('extrude', 'add'); });
  await p.waitForTimeout(800);
  const scr = (w) => p.evaluate((w) => { const R = window.__rezets; const c = document.getElementById('cv').getBoundingClientRect(); const s = R.toScreen(new (R.S.doc.constructor === Object ? Object : Object)() && w); return s; }, w);
  const hpos = () => p.evaluate(() => { const R = window.__rezets; const hd = R.depthHandle(); const c = document.getElementById('cv').getBoundingClientRect(); const k = 11 * (R.camInfo ? 1 : 1);
    const tip = hd.tip.clone(); const base = hd.base.clone(); const s1 = R.toScreen(tip), s0 = R.toScreen(base); return { tip: [c.left + s1.x, c.top + s1.y], base: [c.left + s0.x, c.top + s0.y], depth: hd.f.depth, dir: hd.f.dir ?? 1 }; });
  const h0 = await hpos(); out.h0 = h0;
  const ax = h0.tip[0] - h0.base[0], ay = h0.tip[1] - h0.base[1]; const L = Math.hypot(ax, ay); const ux = ax / L, uy = ay / L;
  const g = [h0.tip[0] + ux * 11, h0.tip[1] + uy * 11];
  await p.mouse.move(g[0], g[1]); await p.mouse.down(); await p.mouse.move(g[0] + ux * L * 0.5, g[1] + uy * L * 0.5, { steps: 5 }); await p.mouse.up(); await p.waitForTimeout(500);
  out.after = await p.evaluate(() => { const f = window.__rezets.S.pm.feature; return { depth: f.depth, dir: f.dir ?? 1, field: document.getElementById('pmDepth')?.value }; });
  await p.screenshot({ path: '/tmp/t146.png' });
  const h1 = await hpos(); const g1 = [h1.tip[0] + ux * 11, h1.tip[1] + uy * 11];
  await p.mouse.move(g1[0], g1[1]); await p.mouse.down(); await p.mouse.move(g1[0] - ux * L * 3, g1[1] - uy * L * 3, { steps: 5 }); await p.waitForTimeout(300);
  out.through = await p.evaluate(() => { const f = window.__rezets.S.pm.feature; return { depth: f.depth, dir: f.dir ?? 1 }; });
  await p.keyboard.press('Escape'); await p.mouse.up(); await p.waitForTimeout(400);
  out.esc = await p.evaluate(() => { const S = window.__rezets.S; return { pm: !!S.pm, depth: S.pm?.feature.depth, dir: S.pm?.feature.dir ?? 1 }; });
  console.log(JSON.stringify(out));
  console.log('expect after depth ≈ 1.5×h0.depth, field equal; through dir flipped; esc pm true, depth = after.depth, dir as after');
  console.log(logs.join('\n')); await b.close(); })();

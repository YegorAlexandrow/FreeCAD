// The view turns over the top: a long vertical drag carries the camera past the pole, the up vector
// flips and the camera keeps looking at the target; in a sketch the left button does not rotate.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  await p.evaluate(() => window.__rezets.loadDoc(window.__rezets.sampleDoc ? window.__rezets.sampleDoc() : { name: 'x', features: [], nid: 1 }));
  const box = await p.$eval('#cv', (c) => { const r = c.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, h: r.height }; });
  const cam = () => p.evaluate(() => window.__rezets.camInfo());
  const drag = async (dx, dy, steps = 20) => { await p.mouse.move(box.x, box.y); await p.mouse.down(); for (let i = 1; i <= steps; i++) await p.mouse.move(box.x + dx * i / steps, box.y + dy * i / steps); await p.mouse.up(); };
  const c0 = await cam(); const up0 = await p.evaluate(() => window.__rezets.S && window.__rezets.camUp());
  await drag(0, box.h * 0.45); await drag(0, box.h * 0.45);
  const c1 = await cam(); const up1 = await p.evaluate(() => window.__rezets.camUp());
  const dirA = await p.evaluate(() => { const c = window.__rezets.camInfo(); const d = [c[0] - c[3], c[1] - c[4], c[2] - c[5]]; const l = Math.hypot(...d); return d.map((v) => v / l); });
  await p.mouse.move(box.x, box.y); await p.mouse.wheel(0, -200); await p.waitForTimeout(100);
  const wheel = await p.evaluate((a) => { const c = window.__rezets.camInfo(); const d = [c[0] - c[3], c[1] - c[4], c[2] - c[5]]; const l = Math.hypot(...d); return +(d[0] / l * a[0] + d[1] / l * a[1] + d[2] / l * a[2]).toFixed(4); }, dirA);
  await drag(box.h * 0.3, 0); const up2 = await p.evaluate(() => window.__rezets.camUp());
  await p.evaluate(() => window.__rezets.startSketch(window.__rezets.PLANES.front)); await p.waitForTimeout(400); const s0 = await cam(); await drag(0, 100); const s1 = await cam();
  console.log(JSON.stringify({ wheel, up0, up1: up1.map((v) => +v.toFixed(2)), up2: up2.map((v) => +v.toFixed(2)), moved: c0.slice(0, 3).some((v, i) => Math.abs(v - c1[i]) > 1), sketchStill: s0.slice(0, 6).every((v, i) => Math.abs(v - s1[i]) < 1e-6) }));
  console.log('expect wheel 1 (zoom keeps the view direction), up1 y < 0 (turned over the top), up2 y < 0 too, moved true, sketchStill true');
  console.log(logs.join('\n')); await b.close();
})();

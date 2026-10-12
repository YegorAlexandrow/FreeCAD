// Dragging ARM2 round its pivot in the user's servo assembly (testdata/big/servo_proj8.json, not in git):
// the part turns smoothly after the cursor, never swinging back, even where the cursor is off its path.
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/servo_proj8.json', 'utf8');
(async () => { const { b, p, logs } = await open();
  const pt = await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d2');
    const r = document.getElementById('cv').getBoundingClientRect(); let best = null;
    for (let y = r.top + 20; y < r.bottom - 20; y += 12) for (let x = r.left + 20; x < r.right - 20; x += 12) { const h = R.asmPick({ clientX: x, clientY: y }); if (h?.comp === 'c17') { const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)); if (!best || d > best.d) best = { x, y, d }; } }
    return best; }, proj);
  console.log('grab', JSON.stringify(pt));
  const ang = () => p.evaluate(() => { const R = window.__rezets; const c = R.S.doc.comps.find((x) => x.id === 'c17'); const q = R.poseOf(c).q; window.__q0 = window.__q0 || q.clone(); const d = window.__q0.clone().invert().multiply(q); const ax = new q.constructor(); return Math.sign(d.x + d.y + d.z || 1) * 2 * Math.atan2(Math.hypot(d.x, d.y, d.z), Math.abs(d.w)); });
  const a0 = await ang(); await p.mouse.move(pt.x, pt.y); await p.mouse.down(); const seq = []; const times = [];
  const box = await p.$eval('#cv', (c) => { const r = c.getBoundingClientRect(); return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 }; });
  for (let i = 1; i <= 40; i++) { const t = i / 40 * Math.PI * 0.9; const x = box.cx + (pt.x - box.cx) * Math.cos(t) - (pt.y - box.cy) * Math.sin(t), y = box.cy + (pt.x - box.cx) * Math.sin(t) + (pt.y - box.cy) * Math.cos(t);
    const t0 = Date.now(); await p.mouse.move(x, y); times.push(Date.now() - t0); seq.push(+(await ang()).toFixed(3)); }
  await p.mouse.up(); await p.waitForTimeout(300);
  const fin = await p.evaluate(() => { const R = window.__rezets; const an = R.S.asmAnalysis; return 'dof ' + an.dof + ' bad ' + an.redundant.size; });
  const jumps = seq.slice(1).map((v, i) => Math.abs(Math.abs(v) - Math.abs(seq[i]))); 
  console.log('angles', seq.join(' ')); console.log('max jump', Math.max(...jumps).toFixed(3), 'back', jumps.filter((j, i) => Math.abs(seq[i + 1]) < Math.abs(seq[i]) - 1e-3).length, fin);
  console.log('expect angles growing smoothly to about 2.2 rad, max jump < 0.2, back 0, dof 1 bad 0');
  console.log(logs.join('\n')); await b.close(); })();

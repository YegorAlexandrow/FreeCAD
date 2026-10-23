// Dragging a free component: the grabbed point stays under the cursor and the part does not turn; one held by a
// coincident face mate slides along the face without turning.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const base = S.project.docs.find((d) => d.name === 'Кронштейн'); R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(base.id); R.asmInsert(base.id); const c = S.doc.comps[1]; c.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 150, 0, 0, 1]; R.asmRefresh(true); });
  await p.click('[data-view="iso"]'); await p.keyboard.press('f'); await p.waitForTimeout(500);
  const box = await p.locator('#cv').boundingBox();
  const grab = await p.evaluate(() => { const R = window.__rezets; const c = R.S.doc.comps[1]; const inf = R.docInfo(c.doc); inf.geo.computeBoundingBox(); const ctr = inf.geo.boundingBox.getCenter(new (inf.geo.boundingBox.min.constructor)()); ctr.z = inf.geo.boundingBox.max.z; ctr.x += 150; return R.toScreen(ctr); });
  const q0 = await p.evaluate(() => window.__rezets.poseOf(window.__rezets.S.doc.comps[1]).q.toArray());
  await p.mouse.move(box.x + grab.x, box.y + grab.y); await p.mouse.down(); await p.mouse.move(box.x + grab.x - 120, box.y + grab.y + 60, { steps: 12 }); await p.mouse.up(); await p.waitForTimeout(300);
  const out = await p.evaluate(([q0, gx, gy]) => { const R = window.__rezets; const ps = R.poseOf(R.S.doc.comps[1]); const q = ps.q.toArray(); const dq = Math.abs(q.reduce((s, v, i) => s + v * q0[i], 0));
    return { turnDeg: +(2 * Math.acos(Math.min(1, dq)) * 180 / Math.PI).toFixed(2), moved: ps.t.toArray().map((v) => +v.toFixed(1)) }; }, [q0, grab.x, grab.y]);
  console.log(JSON.stringify(out));
  console.log('expect turnDeg 0, moved away from [150,0,0]');
  console.log(logs.join('\n')); await b.close(); })();

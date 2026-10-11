const open = require('./harness.js');
const vol = () => { const S = window.__rezets.S; if (!S.body) return 0; const pos = S.body.getAttribute('position'); let v = 0; for (let i = 0; i < pos.count; i += 3) { const a = [pos.getX(i), pos.getY(i), pos.getZ(i)], b = [pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1)], c = [pos.getX(i + 2), pos.getY(i + 2), pos.getZ(i + 2)]; v += a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]); } return v / 6; };
(async () => {
  const { b, p, logs } = await open();
  const box = await (await p.$('#cv')).boundingBox();
  const clickUV = async (u, v) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; const f = R.featById(R.S.editing); return R.toScreen(R.toWorld(f.plane, u, v)); }, [u, v]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 2 }); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(60); };
  const clickWorld = async (x, y, z) => { const s = await p.evaluate(([x, y, z]) => { const R = window.__rezets; return R.toScreen(new (Object.getPrototypeOf(R.toWorld({ o: [0,0,0], x: [1,0,0], y: [0,1,0] }, 0, 0)).constructor)(x, y, z)); }, [x, y, z]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); await p.waitForTimeout(100); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(200); };
  // ---- A: sketch on the top face of the sample boss and cut a slot
  const v0 = await p.evaluate(vol);
  await clickWorld(0, 12, 32); // top face of plate, in front of the boss
  const sel = await p.evaluate(() => ({ t: window.__rezets.S.selectedTree, f: window.__rezets.S.pickedFace }));
  console.log('picked', JSON.stringify(sel));
  await p.keyboard.press('s'); await p.waitForTimeout(500);
  await p.keyboard.press('r'); await clickUV(-30, -28); await clickUV(30, -36);
  await p.click('#corner .ok'); await p.waitForTimeout(300);
  await p.keyboard.press('x'); await p.waitForTimeout(600);
  await p.click('#corner .ok'); await p.waitForTimeout(800);
  const v1 = await p.evaluate(vol); const errA = await p.evaluate(() => window.__rezets.S.errors);
  console.log('cut on face: removed', (v0 - v1).toFixed(2), 'expected', (60 * 8 * 12).toFixed(2), JSON.stringify(errA));
  await p.screenshot({ path: 'shot4.png' });
  // ---- B: revolve in a new part
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Новая деталь' }).click(); await p.waitForTimeout(300);
  await p.locator('.row', { hasText: 'Спереди' }).click(); await p.keyboard.press('s'); await p.waitForTimeout(500);
  await p.keyboard.press('r'); await clickUV(10, 0); await clickUV(30, 40);
  await p.click('#corner .ok'); await p.waitForTimeout(300);
  await p.click('.tool:has-text("Повернуть")'); await p.waitForTimeout(800);
  await p.click('#corner .ok'); await p.waitForTimeout(800);
  const st = await p.evaluate(() => { const R = window.__rezets; const sk = R.S.doc.features[0].sk; return { pts: Object.values(sk.pts).map(p => [Math.round(p.x*1000)/1000, Math.round(p.y*1000)/1000]), err: R.S.errors }; });
  const v2 = await p.evaluate(vol);
  const xs = st.pts.map(q => q[0]), ys = st.pts.map(q => q[1]); const r0 = Math.min(...xs), r1 = Math.max(...xs), hh = Math.max(...ys) - Math.min(...ys);
  console.log('revolve vol', v2.toFixed(1), 'expected', (Math.PI * (r1*r1 - r0*r0) * hh).toFixed(1), JSON.stringify(st));
  await p.screenshot({ path: 'shot5.png' });
  console.log(logs.join('\n'));
  await b.close();
})();

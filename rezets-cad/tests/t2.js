const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const cv = await p.$('#cv'); const box = await cv.boundingBox();
  // screen position of a sketch coordinate in the active sketch
  const scr = async (u, v) => p.evaluate(([u, v]) => { const R = window.__rezets; const f = R.featById(R.S.editing); const s = R.toScreen(R.toWorld(f.plane, u, v)); return s; }, [u, v]);
  const clickUV = async (u, v) => { const s = await scr(u, v); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(80); };
  const st = async () => p.evaluate(() => { const S = window.__rezets.S; const a = S.analysis; return { dof: a?.dof, red: a ? [...a.redundant] : null, cons: S.editing ? Object.values(window.__rezets.featById(S.editing).sk.cons).map(c => c.t + (c.driven ? '(driven)' : '') + (c.v != null ? '=' + Math.round(c.v*1000)/1000 : '')) : null }; });
  // New part
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Новая деталь' }).click(); await p.waitForTimeout(300);
  // Select Top plane in tree, then Sketch
  await p.locator('.row', { hasText: 'Сверху' }).click();
  await p.click('.tool:has-text("Эскиз")'); await p.waitForTimeout(700);
  // Rectangle tool via keyboard R
  await p.keyboard.press('r');
  await clickUV(-40, -25); await clickUV(50, 30);
  console.log('after rect', JSON.stringify(await st()));
  // Smart dimension on the bottom line (y=-25): pick line then place below
  await p.keyboard.press('d');
  await clickUV(5, -25); await clickUV(5, -40);
  await p.waitForTimeout(150);
  await p.keyboard.type('100'); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
  // Right line (x=60 now?) dimension: read current geometry
  const right = await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; const xs = Object.values(sk.pts).map(p => p.x); return Math.max(...xs); });
  await clickUV(right, 0); await clickUV(right + 15, 0);
  await p.keyboard.type('60'); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
  console.log('after dims', JSON.stringify(await st()));
  // Conflicting dimension: dimension the top line too -> should become driven (redundant)
  const top = await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; return Math.max(...Object.values(sk.pts).map(p => p.y)); });
  const left = await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; return Math.min(...Object.values(sk.pts).map(p => p.x)); });
  await clickUV(left + 10, top); await clickUV(left + 10, top + 15); await p.waitForTimeout(150);
  await p.keyboard.press('Escape');
  console.log('after redundant dim', JSON.stringify(await st()));
  await p.keyboard.press('d');
  // Fix position: dimension from origin to bottom-left corner (dx, dy)
  const bl = await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; const ps = Object.values(sk.pts); const xs = Math.min(...ps.map(p=>p.x)), ys = Math.min(...ps.map(p=>p.y)); return [xs, ys]; });
  await clickUV(0, 0); await clickUV(bl[0], bl[1]); await clickUV(bl[0] / 2, bl[1] - 12);
  await p.keyboard.type('40'); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
  await clickUV(0, 0); await clickUV(bl[0], bl[1]); await clickUV(bl[0] - 12, bl[1] / 2);
  await p.keyboard.type('25'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  console.log('after position', JSON.stringify(await st()));
  await p.keyboard.press('Escape');
  // Circle inside, then check Esc does not leave sketch
  await p.keyboard.press('c'); await clickUV(10, 5); await clickUV(22, 5);
  await p.keyboard.press('Escape'); await p.keyboard.press('Escape'); await p.keyboard.press('Escape');
  const stillEditing = await p.evaluate(() => !!window.__rezets.S.editing);
  console.log('esc keeps sketch:', stillEditing);
  await p.screenshot({ path: 'shot2.png' });
  // Exit and extrude
  await p.click('#corner .ok'); await p.waitForTimeout(400);
  await p.click('.tool:has-text("Вытянуть")'); await p.waitForTimeout(500);
  await p.fill('#pmDepth', '15'); await p.press('#pmDepth', 'Enter'); await p.waitForTimeout(800);
  const res = await p.evaluate(() => { const S = window.__rezets.S; const pos = S.body.getAttribute('position'); let v=0; for(let i=0;i<pos.count;i+=3){ const a=[pos.getX(i),pos.getY(i),pos.getZ(i)], b=[pos.getX(i+1),pos.getY(i+1),pos.getZ(i+1)], c=[pos.getX(i+2),pos.getY(i+2),pos.getZ(i+2)]; v += a[0]*(b[1]*c[2]-b[2]*c[1]) - a[1]*(b[0]*c[2]-b[2]*c[0]) + a[2]*(b[0]*c[1]-b[1]*c[0]); } S.body.computeBoundingBox(); return { feats: S.doc.features.map(f=>f.name), vol: v/6, bb: S.body.boundingBox, err: S.errors }; });
  console.log('extrude', JSON.stringify(res), 'expected', (100*60 - Math.PI*144)*15);
  await p.screenshot({ path: 'shot3.png' });
  console.log(logs.join('\n'));
  await b.close();
})();

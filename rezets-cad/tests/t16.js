const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const box = await (await p.$('#cv')).boundingBox();
  const W = (x, y, z) => p.evaluate(([x, y, z]) => { const R = window.__rezets; return R.toScreen(R.toWorld({ o: [x, y, z], x: [1, 0, 0], y: [0, 1, 0] }, 0, 0)); }, [x, y, z]);
  const clickAt = async (s) => { await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); await p.waitForTimeout(80); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(150); };
  // fillet two edges through the UI
  await p.click('.tool:has-text("Скругление")'); await p.waitForTimeout(400);
  await clickAt(await W(10, 12, 40)); await clickAt(await W(60, 12, 0));
  await p.fill('#pmRadius', '4'); await p.press('#pmRadius', 'Tab'); await p.waitForTimeout(900);
  const pm = await p.evaluate(() => window.__rezets.S.pm.feature.edges.length);
  await p.screenshot({ path: 'shot13.png' });
  await p.click('#corner .ok'); await p.waitForTimeout(800);
  const res = await p.evaluate(() => { const S = window.__rezets.S; return { feats: S.doc.features.map(f => f.name), err: S.errors }; });
  console.log('fillet edges', pm, JSON.stringify(res));
  await p.screenshot({ path: 'shot14.png' });
  // relation hotkey + dim preview
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Новая деталь' }).click(); await p.waitForTimeout(300); await p.locator('.row', { hasText: 'Сверху' }).click(); await p.keyboard.press('s'); await p.waitForTimeout(500);
  const clickUV = async (u, v) => clickAt(await p.evaluate(([u, v]) => { const R = window.__rezets; const f = R.featById(R.S.editing); return R.toScreen(R.toWorld(f.plane, u, v)); }, [u, v]));
  await p.keyboard.press('l'); await clickUV(-20, -10); await clickUV(20, 5); await p.keyboard.press('Escape'); await p.keyboard.press('Escape');
  await clickUV(0, -2.5);
  const bar = await p.evaluate(() => !document.getElementById('relbar').hidden && document.getElementById('relbar').textContent);
  await p.keyboard.press('h'); await p.waitForTimeout(200);
  const cons = await p.evaluate(() => { const R = window.__rezets; return Object.values(R.featById(R.S.editing).sk.cons).map(c => c.t); });
  console.log('relbar:', bar, '| after H:', cons);
  await p.keyboard.press('d'); const line = await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; return Object.values(sk.pts).map(p => [p.x, p.y]); });
  await clickUV((line[0][0] + line[1][0]) / 2, line[0][1]);
  const sp = await p.evaluate(([u, v]) => { const R = window.__rezets; const f = R.featById(R.S.editing); return R.toScreen(R.toWorld(f.plane, u, v)); }, [0, line[0][1] - 12]);
  await p.mouse.move(box.x + sp.x, box.y + sp.y, { steps: 4 }); await p.waitForTimeout(200);
  const prev = await p.evaluate(() => { const d = window.__rezets.S.dimPreview; return d && d.t + '=' + d.v.toFixed(2); });
  await p.screenshot({ path: 'shot15.png' });
  await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(150);
  console.log('after place', await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; return [Object.values(sk.cons).map(c => c.t + '=' + c.v), !!R.S.dimEdit, document.activeElement?.id, R.S.dimPick]; }));
  await p.keyboard.type('50');
  // click away instead of Enter: value must apply
  await clickUV(30, 30); await p.waitForTimeout(300);
  const after = await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; return Object.values(sk.cons).filter(c => c.v != null).map(c => c.t + '=' + c.v); });
  console.log('preview', prev, '| applied by click-away:', after);
  console.log(logs.join('\n')); await b.close();
})();

const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const box = await (await p.$('#cv')).boundingBox();
  const clickUV = async (u, v) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; const f = R.featById(R.S.editing); return R.toScreen(R.toWorld(f.plane, u, v)); }, [u, v]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 2 }); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(60); };
  const info = () => p.evaluate(() => { const R = window.__rezets; const f = R.S.editing && R.featById(R.S.editing); return { editing: !!f, ents: f ? Object.keys(f.sk.ents).length : null, cons: f ? Object.values(f.sk.cons).map(c => c.t) : null, feats: R.S.doc.features.length, undo: R.S.undo.length }; });
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Новая деталь' }).click(); await p.waitForTimeout(300);
  await p.locator('.row', { hasText: 'Сверху' }).click(); await p.keyboard.press('s'); await p.waitForTimeout(500);
  console.log('start', JSON.stringify(await info()));
  await p.keyboard.press('r'); await clickUV(-20, -10); await clickUV(20, 10);
  console.log('rect', JSON.stringify(await info()));
  await p.keyboard.press('d'); await clickUV(0, -10); await clickUV(0, -20); await p.waitForFunction(() => document.activeElement?.closest?.('.dimedit'), null, { timeout: 5000 }).catch(() => {}); await p.keyboard.type('50'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  console.log('dim', JSON.stringify(await info()));
  await p.keyboard.press('Control+z'); await p.waitForTimeout(400);
  console.log('undo1', JSON.stringify(await info()));
  await p.keyboard.press('Control+z'); await p.waitForTimeout(400);
  console.log('undo2', JSON.stringify(await info()));
  await p.keyboard.press('Control+y'); await p.waitForTimeout(400);
  console.log('redo', JSON.stringify(await info()));
  // Ctrl+Z with Russian layout: key is 'я'
  await p.keyboard.press('Control+KeyZ'); await p.waitForTimeout(400);
  console.log('undo3', JSON.stringify(await info()));
  console.log(logs.join('\n')); await b.close();
})();

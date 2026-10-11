const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const box = await (await p.$('#cv')).boundingBox();
  const clickUV = async (u, v) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; const f = R.featById(R.S.editing); return R.toScreen(R.toWorld(f.plane, u, v)); }, [u, v]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 2 }); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(60); };
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Новая деталь' }).click(); await p.waitForTimeout(300);
  await p.locator('.row', { hasText: 'Сверху' }).click(); await p.keyboard.press('s'); await p.waitForTimeout(500);
  await p.keyboard.press('r'); await clickUV(-20, -10); await clickUV(20, 10);
  await p.keyboard.press('d'); await clickUV(0, -10);
  console.log('after pick', await p.evaluate(() => [document.querySelector('#editLayer').innerHTML.length, JSON.stringify(window.__rezets.S.dimPick)]));
  await clickUV(0, -20);
  console.log('after place', await p.evaluate(() => [document.querySelector('#editLayer').innerHTML.slice(0, 80), !!window.__rezets.S.dimEdit, document.activeElement?.id]));
  console.log(logs.join('\n')); await b.close();
})();

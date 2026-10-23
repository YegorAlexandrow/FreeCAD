// S0-2: while a line is drawn, its length and angle show next to the cursor.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: R.newSketchData() }] }); R.editFeature(R.featById('f1')); R.setTool('line'); });
  await p.waitForTimeout(300); const box = await (await p.$('#cv')).boundingBox(); const scr = (u, v) => p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]);
  const a = await scr(5, 5); await p.mouse.move(box.x + a.x, box.y + a.y); await p.mouse.click(box.x + a.x, box.y + a.y); const c = await scr(25, 25); await p.mouse.move(box.x + c.x, box.y + c.y, { steps: 5 }); await p.waitForTimeout(200);
  console.log(JSON.stringify(await p.evaluate(() => document.querySelector('.drawtip')?.textContent))); console.log('expect «28.28 мм, 45°»');
  console.log(logs.join('\n')); await b.close(); })();

// S0-5: Esc in the middle of an arc (centre put down) or after a line chain leaves no stray points behind.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: R.newSketchData() }] }); R.editFeature(R.featById('f1')); R.setTool('arc'); });
  await p.waitForTimeout(300); const box = await (await p.$('#cv')).boundingBox(); const scr = (u, v) => p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]);
  const go = async (u, v) => { const s = await scr(u, v); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 4 }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(100); };
  await go(5, 5); await go(15, 5); await p.keyboard.press('Escape'); const arc = await p.evaluate(() => Object.keys(window.__rezets.featById('f1').sk.pts).length);
  await p.evaluate(() => window.__rezets.setTool('line')); await go(20, 20); await go(30, 20); await p.keyboard.press('Escape');
  const line = await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; return [Object.keys(sk.pts).length, Object.keys(sk.ents).length]; });
  console.log(JSON.stringify({ arc, line })); console.log('expect arc 0, line [2, 1] (the segment drawn, no extra start point)');
  console.log(logs.join('\n')); await b.close(); })();

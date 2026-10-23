// S0-3: while drawing a line, typing 25 and Enter ends the segment 25 long in the direction of the cursor; the same
// for a circle's radius.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: R.newSketchData() }] }); R.editFeature(R.featById('f1')); R.setTool('line'); });
  await p.waitForTimeout(300); const box = await (await p.$('#cv')).boundingBox(); const scr = (u, v) => p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]);
  const go = async (u, v, click) => { const s = await scr(u, v); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 4 }); if (click) await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(100); };
  await go(5, 5, true); await go(13, 11); await p.keyboard.type('25');  await p.keyboard.press('Enter'); await p.waitForTimeout(200); await p.keyboard.press('Escape'); await p.keyboard.press('Escape');
  await p.evaluate(() => window.__rezets.setTool('circle')); await go(-20, -20, true); await go(-10, -20); await p.keyboard.type('7'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  console.log(JSON.stringify(await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; const l = Object.values(sk.ents).find((e) => e.t === 'line'); const a = sk.pts[l.p1], c = sk.pts[l.p2];
    return { len: +Math.hypot(c.x - a.x, c.y - a.y).toFixed(3), dir: +(Math.atan2(c.y - a.y, c.x - a.x) * 180 / Math.PI).toFixed(1), r: Object.values(sk.ents).find((e) => e.t === 'circle')?.r }; })));
  console.log('expect len 25, dir 36.9 (towards the cursor), r 7');
  console.log(logs.join('\n')); await b.close(); })();

// S0-14: Ctrl+Z in a line chain takes back the last segment and the chain goes on from the point before it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: R.newSketchData() }] }); R.editFeature(R.featById('f1')); R.setTool('line'); });
  await p.waitForTimeout(300); const box = await (await p.$('#cv')).boundingBox(); const scr = (u, v) => p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]);
  const go = async (u, v) => { const s = await scr(u, v); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 4 }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(150); };
  await go(0, 0); await go(20, 3); await go(25, 20); await p.keyboard.press('Control+z'); await p.waitForTimeout(300);
  const mid = await p.evaluate(() => { const R = window.__rezets; const sk = R.featById('f1').sk; return { tool: R.S.tool, stage: R.S.draw?.stage, lines: Object.keys(sk.ents).length }; });
  await go(10, 25); await p.keyboard.press('Escape');
  const fin = await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; return Object.values(sk.ents).map((e) => [sk.pts[e.p1].x, sk.pts[e.p1].y, sk.pts[e.p2].x, sk.pts[e.p2].y].map((v) => Math.round(v))); });
  console.log(JSON.stringify({ mid, fin })); console.log('expect mid line, stage 1, lines 1; fin [[0,0,20,3],[20,3,10,25]]');
  console.log(logs.join('\n')); await b.close(); })();

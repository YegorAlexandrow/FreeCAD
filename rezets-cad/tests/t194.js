// C21/C22: Offset with nothing picked first: a click on a line takes its whole chain, the side follows the cursor,
// a click on empty space puts the copy there.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(0, 0), P(40, 0), P(40, 20), P(0, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    const a = P(60, 0), c = P(80, 0); sk.ents.m = { id: 'm', t: 'line', p1: a, p2: c };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); });
  await p.waitForTimeout(400); await p.locator('#tools button', { hasText: 'Смещение' }).click(); await p.waitForTimeout(200);
  const box = await (await p.$('#cv')).boundingBox();
  const xy = (u, v) => p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]);
  const go = async (u, v, click) => { const s = await xy(u, v); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 4 }); await p.waitForTimeout(100); if (click) { await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(200); } };
  await go(20, 0, true); const ids = await p.evaluate(() => window.__rezets.S.skOp?.ids);
  await go(20, 10, false); const inside = await p.evaluate(() => window.__rezets.S.toolOpt.offsetFlip);
  await go(20, -25, false); const outside = await p.evaluate(() => window.__rezets.S.toolOpt.offsetFlip);
  await go(20, -25, true);
  const lines = await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; return Object.values(sk.ents).filter((e) => e.t === 'line').length; });
  console.log(JSON.stringify({ ids, inside, outside, lines, op: await p.evaluate(() => !!window.__rezets.S.skOp) }));
  console.log('expect ids the 4 rectangle lines (not m); inside and outside differ; lines 9 (5 + 4 copies); op false');
  console.log(logs.join('\n')); await b.close(); })();

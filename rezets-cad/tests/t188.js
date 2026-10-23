// C1: A in the middle of a line chain draws an arc tangent to the last line, then the chain goes on with lines.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: R.newSketchData() }] }); R.editFeature(R.featById('f1')); R.setTool('line'); });
  await p.waitForTimeout(400); const box = await (await p.$('#cv')).boundingBox();
  const at = async (u, v) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(150); };
  await at(0, 0); await at(20, 0); await p.keyboard.press('a'); await p.waitForTimeout(100);
  const hint = await p.evaluate(() => document.querySelector('#hint')?.textContent || '');
  await at(30, 10); const tool = await p.evaluate(() => window.__rezets.S.tool); await at(30, 30); await p.keyboard.press('Escape');
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const sk = R.featById('f1').sk; const P = (id) => [+sk.pts[id].x.toFixed(2), +sk.pts[id].y.toFixed(2)];
    return { ents: Object.values(sk.ents).map((e) => e.t === 'arc' ? ['arc', P(e.c), +e.r.toFixed(2), P(e.p1), P(e.p2)] : [e.t, P(e.p1), P(e.p2)]), tan: Object.values(sk.cons).filter((c) => c.t === 'tangent').length, err: JSON.stringify(R.S.errors) }; })), tool, hint.slice(0, 40));
  console.log('expect line (0,0)-(20,0); arc centre (20,10) r 10 from (20,0) to (30,10); line (30,10)-(30,30); one tangent; tool line after the arc; hint about a tangent arc');
  console.log(logs.join('\n')); await b.close(); })();

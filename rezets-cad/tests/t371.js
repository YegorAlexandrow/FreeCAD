// S0-39: a circle through three clicked points, a rectangle from its centre (construction diagonals, the centre at
// their middles) and a centreline (the line tool drawing construction lines).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: R.newSketchData() }] }); R.editFeature(R.featById('f1')); });
  await p.waitForTimeout(400); const box = await (await p.$('#cv')).boundingBox();
  const at = async (u, v) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(150); };
  await p.evaluate(() => { const R = window.__rezets; R.setTool('circle'); R.S.toolOpt.circ3 = true; }); await at(30, 20); await at(40, 30); await at(50, 20);
  await p.evaluate(() => { const R = window.__rezets; R.S.toolOpt.circ3 = false; R.setTool('rect'); R.S.toolOpt.rectMid = true; }); await at(-30, 15); await at(-20, 20);
  await p.evaluate(() => { const R = window.__rezets; R.S.toolOpt.rectMid = false; R.setTool('line'); R.S.toolOpt.lineConstr = true; }); await at(-40, -20); await at(40, -20); await p.keyboard.press('Escape');
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const sk = R.featById('f1').sk; const c = Object.values(sk.ents).find((e) => e.t === 'circle'); const cp = sk.pts[c.c];
    const lines = Object.values(sk.ents).filter((e) => e.t === 'line'); const xs = Object.values(sk.pts).map((q) => q.x);
    return { circle: [+cp.x.toFixed(2), +cp.y.toFixed(2), +c.r.toFixed(2)], rectLines: lines.filter((e) => !e.constr).length, constr: lines.filter((e) => e.constr).length, mids: Object.values(sk.cons).filter((k) => k.t === 'midpoint').length, minX: Math.min(...xs) }; })));
  console.log('expect circle [40,20,10]; rectLines 4; constr 3 (two diagonals and the centreline); mids 1 (the second middle follows from the rectangle); minX -40');
  console.log(logs.join('\n')); await b.close(); })();

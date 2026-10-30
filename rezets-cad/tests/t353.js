// S0-17: the sketch fillet tool makes chamfers too: a click on a corner cuts it back the same distance along both
// lines, joins them with a line, and dimensions the two distances from the sharp corner, which stays on both lines.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; };
    P('a', 0, 0); P('b', 20, 0); P('c', 20, 10); sk.ents.A = { id: 'A', t: 'line', p1: 'a', p2: 'b' }; sk.ents.B = { id: 'B', t: 'line', p1: 'b', p2: 'c' }; sk.nid = 100;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); R.setTool('sfillet'); R.S.toolOpt.filletR = 2; });
  await p.waitForTimeout(400); await p.locator('#side .seg button', { hasText: 'Фаска' }).click(); await p.waitForTimeout(100);
  const box = await (await p.$('#cv')).boundingBox(); const s = await p.evaluate(() => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, 20, 0)); });
  await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(300);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const sk = R.featById('f1').sk; const P = (id) => [+sk.pts[id].x.toFixed(3), +sk.pts[id].y.toFixed(3)];
    const lines = Object.values(sk.ents).filter((e) => e.t === 'line'); const ch = lines.find((e) => !['A', 'B'].includes(e.id));
    return { lines: lines.length, arcs: Object.values(sk.ents).filter((e) => e.t === 'arc').length, chamfer: ch && [P(ch.p1), P(ch.p2)], dims: Object.values(sk.cons).filter((c) => c.t === 'dist').map((c) => c.v), dof: R.analyzeSketch(sk).dof }; })));
  console.log('expect lines 3, arcs 0, chamfer [18,0]-[20,2], dims [2,2]');
  console.log(logs.join('\n')); await b.close(); })();

// S0-21: drawing a line on from the end of another, within 3° of square to it, makes it square and keeps a
// perpendicular relation; from the end of an arc, along it, a tangent one.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; };
    P('c', 40, 0); P('s', 50, 0); P('t', 40 + 7.0710678, 7.0710678); sk.ents.A = { id: 'A', t: 'arc', c: 'c', p1: 's', p2: 't', r: 10 }; sk.nid = 100;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); R.setTool('line'); });
  await p.waitForTimeout(400); const box = await (await p.$('#cv')).boundingBox();
  const at = async (u, v) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(150); };
  await at(3, 2); await at(23, 12); await at(18.3, 22); await p.keyboard.press('Escape'); await p.evaluate(() => window.__rezets.setTool('line'));
  await at(47.0710678, 7.0710678); await at(40.3, 14.142); await p.keyboard.press('Escape');
  console.log(JSON.stringify(await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; return Object.values(sk.cons).filter((c) => ['perpendicular', 'tangent'].includes(c.t)).map((c) => c.t); })));
  console.log('expect ["perpendicular","tangent"]');
  console.log(logs.join('\n')); await b.close(); })();

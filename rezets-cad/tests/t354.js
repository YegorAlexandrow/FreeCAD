// S0-30: in the dimension tool a sketch axis is taken as the second item after a line or a circle too (it was only
// after a point): a line parallel to the X axis gets its distance to it, a circle the distance of its centre.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; };
    P('a', 2, 6); P('b', 20, 6); P('o', 30, 15); sk.ents.A = { id: 'A', t: 'line', p1: 'a', p2: 'b' }; sk.ents.C = { id: 'C', t: 'circle', c: 'o', r: 3 }; sk.nid = 100;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); R.setTool('dim'); });
  await p.waitForTimeout(500); const box = await (await p.$('#cv')).boundingBox();
  const at = async (u, v) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(200); };
  await at(10, 6); await at(-6, 0); await at(-3, 3); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  await at(33, 15); await p.waitForTimeout(100); await at(0, 22); await at(15, 26); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  console.log(JSON.stringify(await p.evaluate(() => Object.values(window.__rezets.featById('f1').sk.cons).map((c) => c.t + ' ' + c.refs.join(',') + ' ' + +(+c.v).toFixed(3)))));
  console.log('expect pldist a,H 6 and pldist o,V 30');
  console.log(logs.join('\n')); await b.close(); })();

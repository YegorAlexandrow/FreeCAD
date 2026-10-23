// Smart dimension with the line picked first: select a line, take the Dimension tool, one click places its length.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(0, 0), c = P(40, 0); sk.ents.l0 = { id: 'l0', t: 'line', p1: a, p2: c };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); S.sel = new Set(['e:l0']); R.setTool('dim'); });
  await p.waitForTimeout(500);
  const s = await p.evaluate(() => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, 20, 12)); });
  const box = await (await p.$('#cv')).boundingBox(); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(400);
  console.log(JSON.stringify(await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; return { dims: Object.values(sk.cons).map((c) => [c.t, Math.round(c.v)]), edit: !!document.querySelector('.dimedit') }; })));
  console.log('expect one dimension of 40 (dx) after a single click, its editor open');
  console.log(logs.join('\n')); await b.close(); })();

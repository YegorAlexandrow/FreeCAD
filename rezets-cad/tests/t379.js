// P0-17: the axis of a revolve is picked by clicking a line of its sketch in the view, not only from the list.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; };
    P('a', 10, 0); P('b', 20, 0); P('c', 20, 15); P('d', 10, 15); [['A', 'a', 'b'], ['B', 'b', 'c'], ['C', 'c', 'd'], ['D', 'd', 'a']].forEach(([id, p1, p2]) => { sk.ents[id] = { id, t: 'line', p1, p2 }; });
    P('u', 0, -5); P('w', 0, 25); sk.ents.X = { id: 'X', t: 'line', p1: 'u', p2: 'w', constr: true };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.rebuild(); R.look([0, 0, 1], [0, 1, 0]); R.cmdFeature('revolve', 'add'); });
  await p.waitForTimeout(600); const box = await (await p.$('#cv')).boundingBox();
  const a0 = await p.evaluate(() => window.__rezets.S.pm?.feature?.axis);
  const s = await p.evaluate(() => { const R = window.__rezets; return R.toScreen(R.toWorld(R.PLANES.front, 10, 7)); }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(400);
  const r = await p.evaluate(() => ({ axis: window.__rezets.S.pm?.feature?.axis }));
  console.log(JSON.stringify({ a0, ...r })); console.log('expect a0 X (the construction line by default), axis D after a click on the left side of the profile'); console.log(logs.join('\n')); await b.close(); })();

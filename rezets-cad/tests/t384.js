// P0-32: «До грани» takes a corner of the model too (up to the plane through it across the extrusion): a boss drawn on
// the ground plane ends level with the top corner of a taller block next to it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const rect = (x0, y0, x1, y1) => { const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; }; P('a', x0, y0); P('b', x1, y0); P('c', x1, y1); P('d', x0, y1); [['A', 'a', 'b'], ['B', 'b', 'c'], ['C', 'c', 'd'], ['D', 'd', 'a']].forEach(([id, p1, p2]) => { sk.ents[id] = { id, t: 'line', p1, p2 }; }); return sk; };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk: rect(0, 0, 20, 20) }, { id: 'f2', type: 'extrude', name: 'Б1', sketch: 'f1', mode: 'add', end: 'blind', depth: 30, dir: 1 },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: R.PLANES.top, sk: rect(30, 0, 40, 10) }] }); R.rebuild(); R.look([1, 0.6, 1.2], [0, 1, 0]); R.S.selectedTree = 'feat:f3'; R.cmdFeature('extrude', 'add'); const f = S.pm.feature; f.end = 'face'; S.pm.pickTarget = true; R.renderSide(); });
  await p.waitForTimeout(600); const box = await (await p.$('#cv')).boundingBox();
  const s = await p.evaluate(() => { const R = window.__rezets; return R.toScreen(new (R.toWorld(R.PLANES.top, 0, 0).constructor)(20, 30, 0)); }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(600);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; return { target: S.pm?.feature?.target?.label, err: S.errors[S.pm?.feature?.id] || null, top: (() => { S.body.computeBoundingBox(); return +S.body.boundingBox.max.y.toFixed(3); })() }; });
  console.log(JSON.stringify(r)); console.log('expect target Вершина, err null, top 30'); console.log(logs.join('\n')); await b.close(); })();

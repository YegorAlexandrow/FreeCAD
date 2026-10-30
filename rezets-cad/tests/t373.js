// S0-38: turning and scaling what is selected in a sketch: a rectangle turned 30° about its middle loses its level and
// upright relations and keeps its sizes; scaled ×2 its dimensions double.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; }; P('a', 0, 0); P('b', 20, 0); P('c', 20, 10); P('d', 0, 10);
    [['A', 'a', 'b'], ['B', 'b', 'c'], ['C', 'c', 'd'], ['D', 'd', 'a']].forEach(([id, p1, p2]) => { sk.ents[id] = { id, t: 'line', p1, p2 }; });
    sk.cons.h1 = { id: 'h1', t: 'horizontal', refs: ['A'] }; sk.cons.h2 = { id: 'h2', t: 'horizontal', refs: ['C'] }; sk.cons.v1 = { id: 'v1', t: 'vertical', refs: ['B'] }; sk.cons.v2 = { id: 'v2', t: 'vertical', refs: ['D'] }; sk.cons.w = { id: 'w', t: 'dist', refs: ['a', 'b'], v: 20, pos: [10, -5] }; sk.nid = 100;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); const k = R.featById('f1').sk;
    R.S.sel = new Set(['e:A', 'e:B', 'e:C', 'e:D']); R.transformSel('rot', 30); const ang = +(Math.atan2(k.pts.b.y - k.pts.a.y, k.pts.b.x - k.pts.a.x) * 180 / Math.PI).toFixed(3); const hv = Object.values(k.cons).filter((c) => ['horizontal', 'vertical'].includes(c.t)).length;
    R.S.sel = new Set(['e:A', 'e:B', 'e:C', 'e:D']); R.transformSel('scale', 2); return { ang, hv, w: k.cons.w.v, len: +Math.hypot(k.pts.b.x - k.pts.a.x, k.pts.b.y - k.pts.a.y).toFixed(3) }; });
  console.log(JSON.stringify(r)); console.log('expect ang 30, hv 0, w 40, len 40'); console.log(logs.join('\n')); await b.close(); })();

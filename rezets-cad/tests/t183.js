// A relation on picked geometry fits the second pick to the first: two circles made equal take the first one's size,
// two points made coincident meet at the first one.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    sk.ents.a = { id: 'a', t: 'circle', c: P(0, 0), r: 10 }; sk.ents.b = { id: 'b', t: 'circle', c: P(40, 0), r: 4 }; const p1 = P(0, 30), p2 = P(20, 40); sk.ents.l1 = { id: 'l1', t: 'line', p1, p2: P(-10, 30) }; sk.ents.l2 = { id: 'l2', t: 'line', p1: p2, p2: P(30, 40) };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); const k = R.featById('f1').sk;
    S.sel = new Set(['e:a', 'e:b']); R.applyRelation(R.relationOptions(k).find((q) => q[0] === 'equal')[2]);
    S.sel = new Set(['p:' + p1, 'p:' + p2]); R.applyRelation(R.relationOptions(k).find((q) => q[0] === 'coincident')[2]);
    return { ra: +k.ents.a.r.toFixed(3), rb: +k.ents.b.r.toFixed(3), p1: [k.pts[p1].x, k.pts[p1].y].map((v) => +v.toFixed(3)), p2: [k.pts[p2].x, k.pts[p2].y].map((v) => +v.toFixed(3)) }; })));
  console.log('expect ra 10, rb ≈10; p1 ≈ [0,30], p2 ≈ [0,30]');
  console.log(logs.join('\n')); await b.close(); })();

// J27: deleting a point from the middle of a spline drops that point, the spline stays through the rest.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const pts = [P(0, 0), P(10, 8), P(20, 0), P(30, 8)]; sk.ents.s = { id: 's', t: 'spline', pts, p1: pts[0], p2: pts[3], closed: false };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1'));
    S.sel = new Set(['p:' + pts[1]]); R.deleteSelection(); const k = R.featById('f1').sk; return { spline: k.ents.s ? k.ents.s.pts.length : null, pt: !!k.pts[pts[1]] }; })));
  console.log('expect spline 3, pt false');
  console.log(logs.join('\n')); await b.close(); })();

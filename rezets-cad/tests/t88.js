// A chamfer keeps its edges when the extrude under it changes height: circle and straight edges are found again.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const c = P(0, 0); sk.ents.c1 = { id: 'c1', t: 'circle', c, r: 5 }; const q = [P(20, -5), P(30, -5), P(30, 5), P(20, 5)]; q.forEach((a, i) => { const k = 'l' + i; sk.ents[k] = { id: k, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    const doc = { name: 'Т', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 20, dir: 1, regions: null },
      { id: 'f3', type: 'chamfer', name: 'Фаска1', d: 1, edges: [{ t: 'circle', c: [0, 0, 20], n: [0, 0, 1], r: 5 }, { t: 'line', a: [20, -5, 20], b: [30, -5, 20] }] }] };
    R.loadDoc(doc); const v20 = R.geoVolume(R.S.body); const e20 = JSON.stringify(R.S.errors);
    R.S.doc.features[1].depth = 10; R.rebuild(); const v10 = R.geoVolume(R.S.body);
    const exact10 = Math.PI * 25 * 10 + 100 * 10; return { e20, e10: R.S.errors, cut20: +(Math.PI * 25 * 20 + 2000 - v20).toFixed(2), cut10: +(exact10 - v10).toFixed(2), edges: R.S.doc.features[2].edges.map((e) => e.c ? e.c[2] : e.a[2]) }; })));
  console.log('expect no errors at 20 and 10, the same chamfer volume removed at both heights, edges now at z 10');
  console.log(logs.join('\n')); await b.close(); })();

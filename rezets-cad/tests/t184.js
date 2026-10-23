// Fillet with corners picked first: two corners of a rectangle picked, then the Fillet tool — both are rounded at once;
// two lines meeting at a corner picked first round that corner.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(0, 0), P(40, 0), P(40, 20), P(0, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); const k = R.featById('f1').sk;
    S.sel = new Set(['p:' + q[0], 'p:' + q[1]]); R.setTool('sfillet'); const a1 = Object.values(k.ents).filter((e) => e.t === 'arc').length;
    R.setTool('select'); S.sel = new Set(['e:l2', 'e:l3']); R.setTool('sfillet'); const a2 = Object.values(k.ents).filter((e) => e.t === 'arc').length; return { a1, a2 }; })));
  console.log('expect a1 2, a2 3');
  console.log(logs.join('\n')); await b.close(); })();

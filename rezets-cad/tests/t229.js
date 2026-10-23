// F9: the relations bar offers nothing that would only tie model edges to each other (they cannot move), but still
// offers what moves a sketch line onto a model edge.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y, o = {}) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y, ...o }; return k; };
    const a = P(0, 0, { fixed: true }), c = P(40, 0, { fixed: true }), d = P(0, 20, { fixed: true }), e = P(40, 25, { fixed: true }); sk.ents.m0 = { id: 'm0', t: 'line', p1: a, p2: c }; sk.ents.m1 = { id: 'm1', t: 'line', p1: d, p2: e };
    const g = P(5, 5), h = P(30, 9); sk.ents.l = { id: 'l', t: 'line', p1: g, p2: h };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); const k = R.featById('f1').sk;
    S.sel = new Set(['e:m0', 'e:m1']); const fixed = R.relationOptions(k).map((o) => o[0]); S.sel = new Set(['e:m0', 'e:l']); const mixed = R.relationOptions(k).map((o) => o[0]); return { fixed, mixed }; })));
  console.log('expect fixed [], mixed with parallel, collinear');
  console.log(logs.join('\n')); await b.close(); })();

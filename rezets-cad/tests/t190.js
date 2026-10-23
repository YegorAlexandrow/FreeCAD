// C14: the relations bar does not offer a relation the selection already has, nor its opposite.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(0, 0), c = P(40, 0), d = P(0, 20), e = P(40, 25); sk.ents.l0 = { id: 'l0', t: 'line', p1: a, p2: c }; sk.ents.l1 = { id: 'l1', t: 'line', p1: d, p2: e };
    sk.cons.h = { id: 'h', t: 'horizontal', refs: ['l0'] };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); const k = R.featById('f1').sk;
    const names = () => R.relationOptions(k).map((o) => o[0]);
    S.sel = new Set(['e:l0']); const one = names(); S.sel = new Set(['e:l1']); const free = names();
    S.sel = new Set(['e:l0', 'e:l1']); const pair0 = names(); R.applyRelation(R.relationOptions(k).find((o) => o[0] === 'parallel')[2]); S.sel = new Set(['e:l0', 'e:l1']); const pair1 = names();
    return { one, free, pair0, pair1 }; })));
  console.log('expect one without horizontal and vertical; free both; pair0 with parallel and perpendicular, pair1 without them');
  console.log(logs.join('\n')); await b.close(); })();

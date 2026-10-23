// J23: two lines and a centreline, or two circles and a centreline, can be made symmetric.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const v1 = P(0, -30), v2 = P(0, 30); sk.ents.ax = { id: 'ax', t: 'line', p1: v1, p2: v2, constr: true };
    const a1 = P(-10, 0), a2 = P(-20, 10); sk.ents.la = { id: 'la', t: 'line', p1: a1, p2: a2 }; const b1 = P(22, 12), b2 = P(9, 1); sk.ents.lb = { id: 'lb', t: 'line', p1: b1, p2: b2 };
    sk.ents.ca = { id: 'ca', t: 'circle', c: P(-15, -15), r: 3 }; sk.ents.cb = { id: 'cb', t: 'circle', c: P(14, -17), r: 4 };
    R.tryAddConstraint(sk, { id: 'vv', t: 'vertical', refs: ['ax'] });
    R.loadDoc({ name: 'T', nid: 100, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); const k = R.featById('f1').sk;
    S.sel = new Set(['e:la', 'e:lb', 'e:ax']); const o1 = R.relationOptions(k).find((o) => o[0] === 'symmetric'); R.applyRelation(o1[2]);
    S.sel = new Set(['e:ca', 'e:cb', 'e:ax']); const o2 = R.relationOptions(k).find((o) => o[0] === 'symmetric'); R.applyRelation(o2[2]);
    const X = (id) => +k.pts[id].x.toFixed(2), Y = (id) => +k.pts[id].y.toFixed(2); const ax = X(k.ents.ax.p1);
    return { lines: [X(a1) + X(b2) - 2 * ax, Y(a1) - Y(b2), X(a2) + X(b1) - 2 * ax, Y(a2) - Y(b1)].map((v) => Math.abs(v) < 0.01), circles: [Math.abs(X(k.ents.ca.c) + X(k.ents.cb.c) - 2 * ax) < 0.01, Math.abs(k.ents.ca.r - k.ents.cb.r) < 0.01] }; })));
  console.log('expect all true');
  console.log(logs.join('\n')); await b.close(); })();

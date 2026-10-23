// J13: a new value of an angle dimension turns the second line; the first one stays where it was.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const o = P(0, 0), a = P(40, 0), c = P(30, 30); sk.ents.l1 = { id: 'l1', t: 'line', p1: o, p2: a }; sk.ents.l2 = { id: 'l2', t: 'line', p1: o, p2: c };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); const k = R.featById('f1').sk;
    R.tryAddConstraint(k, { id: 'an', t: 'angle', refs: ['l1', 'l2'] }); R.commitSketch(); });
  await p.waitForTimeout(300); await p.locator('.dimlbl').first().dblclick(); await p.waitForTimeout(200); await p.fill('#dimInput', '60'); await p.press('#dimInput', 'Enter'); await p.waitForTimeout(300);
  console.log(JSON.stringify(await p.evaluate(() => { const k = window.__rezets.featById('f1').sk; const P = (id) => [+k.pts[id].x.toFixed(2), +k.pts[id].y.toFixed(2)]; const l1 = k.ents.l1, l2 = k.ents.l2; const a = P(l2.p2), o = P(l2.p1);
    return { l1: [P(l1.p1), P(l1.p2)], ang: +(Math.atan2(a[1] - o[1], a[0] - o[0]) * 180 / Math.PI - Math.atan2(P(l1.p2)[1] - P(l1.p1)[1], P(l1.p2)[0] - P(l1.p1)[0]) * 180 / Math.PI).toFixed(2) }; })));
  console.log('expect l1 about [[0,0],[40,0]] (barely moved), ang 60');
  console.log(logs.join('\n')); await b.close(); })();

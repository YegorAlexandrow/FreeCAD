// C13: a dimension that would overdefine the sketch turns reference with a toast that can make it driving instead,
// turning the one in its way into a reference dimension.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(0, 0), c = P(40, 0); sk.ents.l0 = { id: 'l0', t: 'line', p1: a, p2: c };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); const k = R.featById('f1').sk;
    R.tryAddConstraint(k, { id: 'd1', t: 'dist', refs: [a, c], v: 40 }); R.applyRelation(() => [{ t: 'dist', refs: [a, c] }]); window.__d2 = Object.keys(k.cons).find((x) => x !== 'd1'); });
  await p.waitForTimeout(200);
  const before = await p.evaluate(() => { const k = window.__rezets.featById('f1').sk; return [!!k.cons.d1?.driven, !!k.cons[window.__d2]?.driven, [...document.querySelectorAll('.toast button')].map((e) => e.textContent)]; });
  await p.locator('.toast button', { hasText: 'Сделать управляющим' }).click(); await p.waitForTimeout(200);
  const after = await p.evaluate(() => { const k = window.__rezets.featById('f1').sk; const P = (id) => k.pts[id]; return [!!k.cons.d1?.driven, !!k.cons[window.__d2]?.driven, +(P(k.ents.l0.p2).x - P(k.ents.l0.p1).x).toFixed(3)]; });
  console.log(JSON.stringify({ before, after }));
  console.log('expect before [false, true, [Сделать управляющим]], after [true, false, 40]');
  console.log(logs.join('\n')); await b.close(); })();

// C15: a relation that conflicts with exactly one other can replace it from the toast in one click.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(0, 0), c = P(40, 3); sk.ents.l0 = { id: 'l0', t: 'line', p1: a, p2: c };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); const k = R.featById('f1').sk;
    R.tryAddConstraint(k, { id: 'v', t: 'vertical', refs: ['l0'] }); R.solveSketch(k);
    R.applyRelation(() => [{ t: 'horizontal', refs: ['l0'] }]); });
  await p.waitForTimeout(200); const btns = await p.$$eval('.toast button', (els) => els.map((e) => e.textContent));
  await p.locator('.toast button', { hasText: 'Заменить' }).click(); await p.waitForTimeout(300);
  console.log(JSON.stringify({ btns, cons: await p.evaluate(() => { const k = window.__rezets.featById('f1').sk; const P = (id) => k.pts[id]; const l = k.ents.l0; return [Object.values(k.cons).map((c) => c.t), +(P(l.p2).y - P(l.p1).y).toFixed(3), window.__rezets.S.conflict.size]; }) }));
  console.log('expect buttons Выделить, Заменить; after: [horizontal], dy 0, no conflict marked');
  console.log(logs.join('\n')); await b.close(); })();

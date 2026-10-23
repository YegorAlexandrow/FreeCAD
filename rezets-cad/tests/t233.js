// J24: «Зафиксировать» is offered for a line too and fixes both its ends.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(0, 0), c = P(30, 10); sk.ents.l = { id: 'l', t: 'line', p1: a, p2: c };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); const k = R.featById('f1').sk;
    S.sel = new Set(['e:l']); const opt = R.relationOptions(k).find((o) => o[0] === 'fix'); R.applyRelation(opt[2]); return { offered: !!opt, fixes: Object.values(k.cons).filter((c) => c.t === 'fix').length, dof: S.analysis.dofMain }; })));
  console.log('expect offered true, fixes 2, dof 0');
  console.log(logs.join('\n')); await b.close(); })();

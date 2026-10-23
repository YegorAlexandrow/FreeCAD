// Sketch pattern copies keep their ids: a dimension on a copy survives a larger count, is dropped (no crash) when the
// copy goes away; deleting the source leaves the copies as ordinary curves that a later change does not sweep away.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1000);
  const out = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const o = {};
    const sk = R.newSketchData(); const k = String(sk.nid++); sk.pts[k] = { id: k, x: 0, y: 0 }; sk.ents.c = { id: 'c', t: 'circle', c: k, r: 2 };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1'));
    const s2 = R.featById('f1').sk; const pt = R.makePattern(s2, ['c'], { kind: 'lin', n: 3, dx: 10, dy: 0 }); R.commitSketch();
    const copy2 = Object.values(s2.ents).find((e) => e.pat && e.id.endsWith('_2_c')); o.copyId = copy2?.id;
    const r = R.tryAddConstraint(s2, { id: 'd1', t: 'diam', refs: [copy2.id], v: 6 }); o.dim = r.status;
    R.updatePattern(s2, pt, { n: 4 }); o.dimAfter4 = !!s2.cons.d1; o.circles4 = Object.values(s2.ents).filter((e) => e.t === 'circle').length;
    R.updatePattern(s2, pt, { n: 2 }); o.dimAfter2 = !!s2.cons.d1; o.circles2 = Object.values(s2.ents).filter((e) => e.t === 'circle').length;
    S.sel = new Set(['e:c']); R.deleteSelection(); o.afterDel = Object.values(s2.ents).filter((e) => e.t === 'circle').length; o.pats = Object.keys(s2.pats || {}).length; o.flags = Object.values(s2.ents).filter((e) => e.pat).length;
    return o; });
  console.log(JSON.stringify(out));
  console.log('expect dim ok; dimAfter4 true, circles4 4; dimAfter2 false, circles2 2; afterDel 1, pats 0, flags 0; no PAGEERROR');
  console.log(logs.join('\n')); await b.close(); })();

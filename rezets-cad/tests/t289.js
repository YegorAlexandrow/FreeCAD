// Offset with «Исходные сделать вспомогательными»: the new chain is drawn and the one offset from turns construction.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(40, 0), P(40, 20), P(0, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }] }); R.editFeature(R.S.doc.features[0]); R.S.sel = new Set(['e:l0', 'e:l1', 'e:l2', 'e:l3']); });
  await p.waitForTimeout(500); await p.click('button.tool >> text=Смещение'); await p.waitForTimeout(200);
  await p.click('#side label.chk >> text=Исходные сделать вспомогательными'); await p.click('#side .chip >> text=OK'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => { const es = Object.values(window.__rezets.S.doc.features[0].sk.ents); return { constr: es.filter((e) => e.constr).map((e) => e.id).sort(), solid: es.filter((e) => !e.constr).length }; });
  console.log(JSON.stringify(r)); console.log('expect constr [l0,l1,l2,l3], solid 4 (the offset chain)');
  console.log(logs.join('\n')); await b.close(); })();

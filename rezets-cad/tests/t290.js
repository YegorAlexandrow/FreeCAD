// Deleting the first curve of an offset chain keeps the other copies tied to one visible offset dimension, not to
// the deleted one's hidden relation.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(40, 0), P(40, 20), P(0, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }] }); R.editFeature(R.S.doc.features[0]); R.S.sel = new Set(['e:l0', 'e:l1', 'e:l2', 'e:l3']); });
  await p.waitForTimeout(500); await p.click('button.tool >> text=Смещение'); await p.waitForTimeout(200); await p.click('#side .chip >> text=OK'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = S.doc.features[0].sk; const m = Object.values(sk.cons).find((c) => c.t === 'offd');
    S.sel = new Set(['e:' + m.refs[0]]); R.deleteSelection(); const cons = Object.values(sk.cons); const offs = cons.filter((c) => c.t === 'offset');
    return { offd: cons.filter((c) => c.t === 'offd').length, offsets: offs.length, tied: offs.every((c) => sk.cons[c.m]?.t === 'offd') }; });
  console.log(JSON.stringify(r)); console.log('expect offd 1, offsets 3, tied true');
  console.log(logs.join('\n')); await b.close(); })();

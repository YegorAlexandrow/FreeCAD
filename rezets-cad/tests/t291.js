// Sketch fillet with «Сохранять угловую точку»: the sharp corner stays as a point on both lines (virtual sharp).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(40, 0), P(40, 20), P(0, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }] }); R.editFeature(S.doc.features[0]);
    const k = S.doc.features[0].sk; const out = {}; R.filletCorner(k, q[0], 5); out.plain = q[0] in k.pts; S.toolOpt.keepCorner = true; R.filletCorner(k, q[2], 5); out.kept = q[2] in k.pts;
    out.on = Object.values(k.cons).filter((c) => c.t === 'online' && c.refs[0] === q[2]).length; R.solveSketch(k); const pt = k.pts[q[2]]; out.at = [Math.round(pt.x * 1e6) / 1e6, Math.round(pt.y * 1e6) / 1e6]; return out; });
  console.log(JSON.stringify(r)); console.log('expect plain false, kept true, on 2, at [40,20]');
  console.log(logs.join('\n')); await b.close(); })();

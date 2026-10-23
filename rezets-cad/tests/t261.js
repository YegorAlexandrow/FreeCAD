// H24: a revolve of 90° «Симметрично» spans 45° each side of the sketch plane.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(10, 0), P(20, 0), P(20, 10), P(10, 10)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    const run = (mid) => { R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: JSON.parse(JSON.stringify(sk)) }, { id: 'f2', type: 'revolve', name: 'В', sketch: 'f1', mode: 'add', axis: 'V', angle: 90, dir: 1, ...(mid ? { mid: true } : {}) }] });
      S.body.computeBoundingBox(); const bb = S.body.boundingBox; return [bb.min.z, bb.max.z].map((v) => +v.toFixed(2)); };
    return { plain: run(false), mid: run(true) }; })));
  console.log('expect plain one-sided in z, mid symmetric (min = -max)');
  console.log(logs.join('\n')); await b.close(); })();

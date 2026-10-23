// N34: a sketch on the top face of a block is flagged when a cut put before it takes the face away (3 mm off the top),
// and when the block itself is deleted; the flag goes when the face is back.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const mk = (x0, y0, w, h) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
      const q = [P(x0, y0), P(x0 + w, y0), P(x0 + w, y0 + h), P(x0, y0 + h)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); return sk; };
    const top = (d) => ({ label: 'Грань', o: [0, 0, d], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1], face: { by: 'f2', d } });
    const feats = [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: mk(-20, -20, 40, 40) }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null },
      { id: 'f5', type: 'sketch', name: 'Эскиз3', plane: { label: 'Грань', o: [0, 0, 10], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] }, sk: mk(-30, -30, 60, 60) }, { id: 'f6', type: 'extrude', name: 'Вырез1', sketch: 'f5', mode: 'cut', end: 'blind', depth: 3, dir: -1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: top(10), sk: mk(-5, -5, 10, 10) }, { id: 'f4', type: 'extrude', name: 'Бобышка2', sketch: 'f3', mode: 'add', end: 'blind', depth: 5, dir: 1, regions: null }];
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: feats.filter((f) => f.id !== 'f5' && f.id !== 'f6') }); const ok = S.offFace.has('f3');
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: JSON.parse(JSON.stringify(feats)) }); const cut = S.offFace.has('f3');
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: JSON.parse(JSON.stringify(feats)).filter((f) => !['f5', 'f6'].includes(f.id)) }); R.deleteFeature(R.featById('f2')); const gone = S.offFace.has('f3');
    return { ok, cut, gone }; })));
  console.log('expect ok false, cut true, gone true');
  console.log(logs.join('\n')); await b.close(); })();

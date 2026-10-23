// N35: «До грани» to the top of a boss is an error once that boss is deleted, not an extrusion to where the face was.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const mk = (x0, y0, w, h) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
      const q = [P(x0, y0), P(x0 + w, y0), P(x0 + w, y0 + h), P(x0, y0 + h)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); return sk; };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: mk(-20, -20, 40, 40) }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: { label: 'Грань', o: [0, 0, 10], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1], face: { by: 'f2', d: 10 } }, sk: mk(-5, -5, 10, 10) }, { id: 'f4', type: 'extrude', name: 'Бобышка2', sketch: 'f3', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null },
      { id: 'f5', type: 'sketch', name: 'Эскиз3', plane: { label: 'Грань', o: [0, 0, 10], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1], face: { by: 'f2', d: 10 } }, sk: mk(10, 10, 5, 5) },
      { id: 'f6', type: 'extrude', name: 'Бобышка3', sketch: 'f5', mode: 'add', end: 'face', target: { label: 'Грань', o: [0, 0, 20], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1], face: { by: 'f4', d: 20 } }, depth: 10, dir: 1, regions: null }] });
    const ok = { err: S.errors.f6 || null, v: +R.geoVolume(S.body).toFixed(0) }; R.deleteFeature(R.featById('f4')); return { ok, gone: S.errors.f6 || null }; })));
  console.log('expect ok no error (v 17250), gone an error about the face');
  console.log(logs.join('\n')); await b.close(); })();

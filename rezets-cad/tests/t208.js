// N27/N44: deleting the middle section of a loft or the path of a sweep takes the loft or sweep with it (toast with
// Undo), instead of a loft quietly rebuilt from two sections or a sweep left with an error.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const P = (sk, x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const sq = (w) => { const sk = R.newSketchData(); const q = [P(sk, -w, -w), P(sk, w, -w), P(sk, w, w), P(sk, -w, w)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); return sk; };
    const pl = (z) => ({ label: 'П', o: [0, 0, z], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 's1', type: 'sketch', name: 'С1', plane: pl(0), sk: sq(10) }, { id: 's2', type: 'sketch', name: 'С2', plane: pl(10), sk: sq(5) }, { id: 's3', type: 'sketch', name: 'С3', plane: pl(20), sk: sq(10) },
      { id: 'f4', type: 'loft', name: 'ПоСечениям1', sketch: 's1', sketches: ['s1', 's2', 's3'], mode: 'add' }] });
    const v0 = +R.geoVolume(S.body).toFixed(0); R.deleteFeature(R.featById('s2'));
    const loft = { v0, left: S.doc.features.map((f) => f.id), toast: document.querySelector('.toast')?.textContent };
    const path = R.newSketchData(); const a = P(path, 0, 0), c = P(path, 0, 40); path.ents.p = { id: 'p', t: 'line', p1: a, p2: c };
    const prof = R.newSketchData(); prof.ents.c = { id: 'c', t: 'circle', c: P(prof, 0, 0), r: 3 };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'pa', type: 'sketch', name: 'Путь', plane: R.PLANES.right, sk: path }, { id: 'pr', type: 'sketch', name: 'Профиль', plane: R.PLANES.top, sk: prof }, { id: 'sw', type: 'sweep', name: 'ПоТраектории1', sketch: 'pr', path: 'pa', mode: 'add', regions: null }] });
    const e0 = JSON.stringify(S.errors); R.deleteFeature(R.featById('pa'));
    return { loft, sweep: { e0, left: S.doc.features.map((f) => f.id) } }; })));
  console.log('expect loft.left [s1, s3], toast names ПоСечениям1; sweep e0 {}, left [pr]');
  console.log(logs.join('\n')); await b.close(); })();

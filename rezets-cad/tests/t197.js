// N31/N32: deleting the mirror's plane keeps the mirror where the plane was; deleting the mirrored feature makes
// the mirror an error instead of a mirror of the whole body.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const mk = (x0, x1) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
      const q = [P(x0, 0), P(x1, 0), P(x1, 10), P(x0, 10)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); return sk; };
    const doc = () => ({ name: 'T', nid: 40, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: mk(-40, -20) }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 5, dir: 1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: R.PLANES.front, sk: mk(0, 10) }, { id: 'f4', type: 'extrude', name: 'Бобышка2', sketch: 'f3', mode: 'add', end: 'blind', depth: 5, dir: 1, regions: null },
      { id: 'f30', type: 'plane', name: 'Плоскость1', base: { std: 'right' }, d: 30 }, { id: 'f5', type: 'mirror', name: 'Зеркало1', plane: { plane: 'f30' }, feats: ['f4'] }] });
    const bb = () => { S.body.computeBoundingBox(); const q = S.body.boundingBox; return [+q.min.x.toFixed(1), +q.max.x.toFixed(1)]; };
    R.loadDoc(doc()); const b0 = bb(); R.deleteFeature(R.featById('f30')); const b1 = bb(); const e1 = S.errors.f5 || null;
    R.loadDoc(doc()); R.deleteFeature(R.featById('f4')); const e2 = S.errors.f5 || null; const v2 = +R.geoVolume(S.body).toFixed(1);
    return { b0, b1, e1, e2, v2 }; })));
  console.log('expect b0 = b1 = [-40, 60] (copy at 50..60), e1 null; e2 an error about deleted features, v2 1000 (only Бобышка1)');
  console.log(logs.join('\n')); await b.close(); })();

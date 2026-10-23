// N19: a shell with every face removed says so, instead of «thickness too large».
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(-20, -10), P(20, -10), P(20, 10), P(-20, 10)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    const all = [[0, 0, 1, 10], [0, 0, -1, 0], [1, 0, 0, 20], [-1, 0, 0, 20], [0, 1, 0, 10], [0, -1, 0, 10]].map(([x, y, z, d]) => ({ n: [x, y, z], d }));
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Б', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null }, { id: 'f3', type: 'shell', name: 'Оболочка1', t: 1, faces: all }] });
    const allErr = S.errors.f3; R.featById('f3').faces = all.slice(0, 1); S.cache.clear(); R.rebuild(); return { allErr, oneErr: S.errors.f3 || null, v: +R.geoVolume(S.body).toFixed(0) }; })));
  console.log('expect allErr about removing every face; oneErr null, v 8000 - 38*18*9 = 1844');
  console.log(logs.join('\n')); await b.close(); })();

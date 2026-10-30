// P0-15: «Направление 2»: an extrusion on both sides of its sketch by two depths, 10 one way and 5 the other.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; };
    P('a', 0, 0); P('b', 40, 0); P('c', 40, 20); P('d', 0, 20); [['A', 'a', 'b'], ['B', 'b', 'c'], ['C', 'c', 'd'], ['D', 'd', 'a']].forEach(([id, p1, p2]) => { sk.ents[id] = { id, t: 'line', p1, p2 }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Б', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, depth2: 5, dir: 1 }] }); R.rebuild();
    S.body.computeBoundingBox(); const bb = S.body.boundingBox; return { vol: +R.geoVolume(S.body).toFixed(1), z: [+bb.min.z.toFixed(3), +bb.max.z.toFixed(3)] }; });
  console.log(JSON.stringify(r)); console.log('expect vol 12000, z [-5,10]'); console.log(logs.join('\n')); await b.close(); })();

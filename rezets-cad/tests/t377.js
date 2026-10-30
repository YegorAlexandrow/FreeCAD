// P0-13: a chamfer with two distances: 2 along one face and 4 along the other, on an edge of a box; the volume taken
// is the triangle 2 × 4 / 2 times the edge length; «Поменять стороны» swaps them.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; };
    P('a', 0, 0); P('b', 40, 0); P('c', 40, 20); P('d', 0, 20); [['A', 'a', 'b'], ['B', 'b', 'c'], ['C', 'c', 'd'], ['D', 'd', 'a']].forEach(([id, p1, p2]) => { sk.ents[id] = { id, t: 'line', p1, p2 }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Б', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1 }] }); R.rebuild();
    const v0 = R.geoVolume(S.body); const T = R.edgeTopology(S.body, S.cyls); const [a, b] = T.lines.find(([a, b]) => Math.abs(a.y - 20) < 1e-6 && Math.abs(b.y - 20) < 1e-6 && Math.abs(a.z - 10) < 1e-6 && Math.abs(b.z - 10) < 1e-6);
    const f = { id: 'f3', type: 'chamfer', name: 'Ф', d: 2, d2: 4, edges: [{ t: 'line', a: a.toArray(), b: b.toArray() }] }; S.doc.features.push(f); R.rebuild(); const v1 = R.geoVolume(S.body);
    // where the slope lands on the top face (z = 10): 2 or 4 from the edge
    const topY = () => { const pos = S.body.getAttribute('position'); let m = 0; for (let i = 0; i < pos.count; i++) if (Math.abs(pos.getZ(i) - 10) < 1e-6) m = Math.max(m, pos.getY(i)); return +m.toFixed(3); };
    const y1 = topY(); f.flip = true; R.rebuild(); const y2 = topY(); return { dv: +(v0 - v1).toFixed(3), y1, y2, err: S.errors.f3 || null }; });
  console.log(JSON.stringify(r)); console.log('expect dv 160 (2×4/2 × 40), y1 and y2 18 and 16 in some order, err null');
  console.log(logs.join('\n')); await b.close(); })();

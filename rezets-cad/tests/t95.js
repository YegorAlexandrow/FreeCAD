// Chamfers stay on the rim they were put on when the boss grows by exactly its own height: 2 → 4 mm puts the old
// top rim halfway between the new top and the bottom (the user's plate with eight holes, testdata/part_chamfer_810.json),
// and a box's top edge likewise.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/part_chamfer_810.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((d) => { const R = window.__rezets; const out = {};
    d.features.find((f) => f.id === 'f2').depth = 2; d.features.find((f) => f.id === 'f5').edges.forEach((e) => (e.c[1] = 2)); R.loadDoc(d);
    out.err2 = R.S.errors; out.ys2 = [...new Set(R.S.doc.features.find((f) => f.id === 'f5').edges.map((e) => e.c[1]))];
    R.S.doc.features.find((f) => f.id === 'f2').depth = 4; R.rebuild(); out.err4 = R.S.errors; out.ys4 = [...new Set(R.S.doc.features.find((f) => f.id === 'f5').edges.map((e) => +e.c[1].toFixed(3)))];
    const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(10, 0), P(10, 10), P(0, 10)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 2, dir: 1, regions: null }, { id: 'f3', type: 'chamfer', name: 'Фаска1', d: 0.5, edges: [{ t: 'line', a: [0, 0, 2], b: [10, 0, 2] }] }] });
    R.S.doc.features[1].depth = 4; R.rebuild(); out.boxErr = R.S.errors; out.boxZ = R.S.doc.features[2].edges[0].a[2];
    return out; }, doc)));
  console.log('expect no errors, rims at y 2 then y 4 (not 0), the box edge at z 4 (not 0)');
  console.log(logs.join('\n')); await b.close(); })();

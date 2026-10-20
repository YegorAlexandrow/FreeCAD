// STL import: our own part (a plate with a round hole and a slot) saved as STL, read back, faces found (plane top,
// cylinders of the hole and the slot ends), used as a part body and edited: a cut and a sketch on its face.
const open = require('./harness.js'); const fs = require('fs'); const path = require('path');
(async () => { const { b, p, logs } = await open();
  const stl = await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(-20, -10), P(20, -10), P(20, 10), P(-20, 10)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); sk.ents.h = { id: 'h', t: 'circle', c: P(-10, 0), r: 3 };
    const a = P(4, 3), b2 = P(4, -3), c = P(12, -3), d = P(12, 3), c1 = P(4, 0), c2 = P(12, 0); sk.ents.s1 = { id: 's1', t: 'arc', c: c1, p1: a, p2: b2, r: 3 }; sk.ents.s2 = { id: 's2', t: 'line', p1: b2, p2: c }; sk.ents.s3 = { id: 's3', t: 'arc', c: c2, p1: c, p2: d, r: 3 }; sk.ents.s4 = { id: 's4', t: 'line', p1: d, p2: a };
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 5, dir: 1, regions: null }] });
    window.__v0 = R.geoVolume(R.S.body); return Array.from(new Uint8Array(R.stlBinary(R.S.body))); });
  const file = '/tmp/claude-0/-home-user/922fd1d6-a4fe-5bbc-a891-f41e1f96d977/scratchpad/plate.stl'; fs.writeFileSync(file, Buffer.from(stl));
  await p.setInputFiles('#stepIn', file); await p.waitForFunction(() => window.__rezets.S.mode === 'import', null, { timeout: 30000 });
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const ent = R.activeEntry(); const d = ent.data;
    const out = { kind: ent.kind, faces: d.faces.length, cyls: d.cyls.map((c) => +c.r.toFixed(3)).sort(), vol: +R.geoVolume(R.importGeometry(ent)).toFixed(1), v0: +window.__v0.toFixed(1) };
    R.addDoc('part', 'Деталь', { name: 'Деталь', nid: 10, rollback: null, features: [{ id: 'f1', type: 'stepbody', name: 'STEP-тело1', doc: ent.id }] }); R.rebuild();
    const sk = R.newSketchData(); sk.pts.c = { id: 'c', x: 15, y: 5 }; sk.ents.k = { id: 'k', t: 'circle', c: 'c', r: 2 };
    // the STL is Z-up turned Y-up: the plate's top is now the face at y = 5 or z...; cut through along the plate's thickness axis
    S.body.computeBoundingBox(); const bb = S.body.boundingBox; out.box = [bb.min.toArray(), bb.max.toArray()].map((v) => v.map((x) => +x.toFixed(2)));
    const thin = ['x', 'y', 'z'].reduce((a, k) => (bb.max[k] - bb.min[k] < bb.max[a] - bb.min[a] ? k : a), 'x'); const n = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] }[thin];
    const X = thin === 'x' ? [0, 1, 0] : [1, 0, 0]; const Y = [n[1] * X[2] - n[2] * X[1], n[2] * X[0] - n[0] * X[2], n[0] * X[1] - n[1] * X[0]];
    S.doc.features.push({ id: 'f2', type: 'sketch', name: 'Эскиз1', plane: { label: 'Грань', o: n.map((v) => v * bb.max[thin]), x: X, y: Y, n }, sk }, { id: 'f3', type: 'extrude', name: 'Вырез1', sketch: 'f2', mode: 'cut', end: 'through', depth: 20, dir: -1, regions: null });
    const v1 = R.geoVolume(S.body); R.rebuild(); out.cut = +(v1 - R.geoVolume(S.body)).toFixed(2); out.err = JSON.stringify(S.errors);
    R.startSketch({ label: 'Грань', o: n.map((v) => v * bb.max[thin]), x: X, y: Y, n }); out.refs = { lines: S.refs.lines.length, circles: S.refs.circles.length }; return out; })));
  console.log('expect kind import, cyls include 3 (hole and slot ends), vol = v0, cut 62.8 (pi*4*5), no errors, refs with lines and circles on the face');
  console.log(logs.join('\n')); await b.close(); })();

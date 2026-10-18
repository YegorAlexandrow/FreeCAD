// «Контур грани» on a STEP model used as a part body (servo_horn): a sketch on its top face takes the face outline,
// and extruding it thickens the horn by the same shape.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  await p.setInputFiles('#stepIn', __dirname + '/../testdata/servo_horn.step'); await p.waitForFunction(() => window.__rezets.S.mode === 'import', null, { timeout: 60000 });
  console.log(JSON.stringify(await p.evaluate(async () => { const R = window.__rezets; const S = R.S; const imp = S.project.active;
    R.addDoc('part', 'Деталь', { name: 'Деталь', nid: 10, rollback: null, features: [{ id: 'f1', type: 'stepbody', name: 'STEP-тело1', doc: imp }] }); R.rebuild();
    S.body.computeBoundingBox(); const bb = S.body.boundingBox; const v0 = R.geoVolume(S.body);
    // the top face: highest planar face facing +Y or +Z, whichever axis the horn is flat along
    const ax = ['x', 'y', 'z'].reduce((a, k) => (bb.max[k] - bb.min[k] < bb.max[a] - bb.min[a] ? k : a), 'x');
    const n = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] }[ax]; const top = bb.max[ax];
    const pos = S.body.getAttribute('position'); let at = null;
    for (let i = 0; i < pos.count && !at; i += 3) { const a = [pos.getX(i), pos.getY(i), pos.getZ(i)], b2 = [pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1)], c = [pos.getX(i + 2), pos.getY(i + 2), pos.getZ(i + 2)]; const k = 'xyz'.indexOf(ax); if ([a, b2, c].every((v) => Math.abs(v[k] - top) < 1e-4)) at = [0, 1, 2].map((j) => (a[j] + b2[j] + c[j]) / 3); }
    const X = ax === 'x' ? [0, 1, 0] : [1, 0, 0]; const Y = [n[1] * X[2] - n[2] * X[1], n[2] * X[0] - n[0] * X[2], n[0] * X[1] - n[1] * X[0]];
    R.startSketch({ label: 'Грань', o: n.map((v) => v * top), x: X, y: Y, n }); const f = S.doc.features.find((g) => g.id === S.editing);
    const u = at[0] * X[0] + at[1] * X[1] + at[2] * X[2], v = at[0] * Y[0] + at[1] * Y[1] + at[2] * Y[2];
    const r = R.convertFace(f.sk, { u, v }); R.commitSketch(); R.exitSketch();
    S.selectedTree = 'feat:' + f.id; R.cmdFeature('extrude', 'add'); S.pm.feature.depth = 1; S.pm.feature.dir = 1; R.okPM();
    return { lines: r, regions: R.sketchRegionsOf(f).faces.length, dv: +(R.geoVolume(S.body) - v0).toFixed(1), err: JSON.stringify(S.errors) }; })));
  console.log('expect lines > 0, regions >= 1, dv > 0 (face area * 1 mm), no errors');
  console.log(logs.join('\n')); await b.close(); })();

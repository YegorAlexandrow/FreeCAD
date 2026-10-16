// A STEP model as the base body of a part: the servo horn from the project becomes the body, a sketch on one of
// its flat faces cuts a hole through it, and the result stays one closed body.
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/servo_proj10.json', 'utf8');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s)));
    const imp = R.S.project.docs.find((d) => d.kind === 'import' && d.name === 'servo_horn') || R.S.project.docs.find((d) => d.kind === 'import');
    R.S.project.nid = 100; const ent = R.addDoc('part', 'Доработка', { name: 'Доработка', nid: 10, rollback: null, features: [] }); R.switchDoc(ent.id); R.cmdStepBody();
    const out = { imp: imp.name, feats: R.S.doc.features.map((f) => f.type), err: R.S.errors };
    const v0 = R.geoVolume(R.S.body); out.v0 = +v0.toFixed(1); const bb = R.S.body.clone(); bb.computeBoundingBox(); const B = bb.boundingBox;
    // a flat face: the top of the body along +Y, a 2 mm hole sketched at its centre, cut through all
    const y = B.max.y; const cx = (B.min.x + B.max.x) / 2, cz = (B.min.z + B.max.z) / 2;
    const sk = R.newSketchData(); const c = String(sk.nid++); sk.pts[c] = { id: c, x: cx, y: -cz }; sk.ents.k = { id: 'k', t: 'circle', c, r: 1 };
    R.S.doc.features.push({ id: 'fs', type: 'sketch', name: 'Эскиз1', plane: { ...R.PLANES.top, o: [0, y, 0] }, sk }, { id: 'fc', type: 'extrude', name: 'Вырез1', sketch: 'fs', mode: 'cut', end: 'through', depth: 20, dir: -1, regions: null });
    R.rebuild(); out.errCut = R.S.errors; out.removed = +(v0 - R.geoVolume(R.S.body)).toFixed(2); out.mf = R.manifoldOn();
    return out; }, proj)));
  console.log('expect feats [stepbody], no errors, removed > 0 (a hole cut through the STEP body)');
  console.log(logs.join('\n')); await b.close(); })();

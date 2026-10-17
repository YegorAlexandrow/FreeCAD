// The user's ARM1 Эскиз3 (testdata/arm1_user3.json): two unused model points left in the sketch, on a plane where
// the model has nothing now. They are not reported as hanging and go away when the sketch is closed.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm1_user3.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc);
    const f = S.doc.features.find((g) => g.name === 'Эскиз3'); const out = { dangling: S.dangling.get(f.id) || null, treeRed: [...document.querySelectorAll('#side .row.err .nm')].map((x) => x.textContent) };
    out.offFace = S.offFace.has(f.id); out.warn = document.querySelector('#side .row.err')?.title;
    R.editFeature(f); R.exitSketch(); out.pts = Object.keys(f.sk.pts); out.err = JSON.stringify(S.errors);
    // moved onto the bottom face (z -19.5), keeping its axes
    R.S.pm = null; window.__rezets.sketchOnPlane ? 0 : 0; R.openPM({ kind: 'pickPlane', replan: f.id }); R.sketchOnPlane({ label: 'Грань', o: [0, 0, -19.5], x: [0, 1, 0], y: [1, 0, 0], n: [0, 0, -1], face: { by: 'f2', d: 19.5 } });
    out.plane = f.plane; out.offFace2 = S.offFace.has(f.id); out.c7 = [f.sk.pts[7].x, f.sk.pts[7].y]; return out; }, doc)));
  console.log('expect dangling null, treeRed [Эскиз3] off its face with a warning; pts 7,18 only, no errors; plane o z -19.5 with x [1,0,0] y [0,-1,0], face by f2; offFace2 false; c7 still -144,0');
  console.log(logs.join('\n')); await b.close(); })();

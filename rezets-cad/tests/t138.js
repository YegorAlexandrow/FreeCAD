// The user's Деталь 9: a 3.6 mm plate, Эскиз2 on its top face with squares and triangles. A cut «through all»,
// reversed into the plate, with a 15° draft: the tool now reaches just past the plate, so the pockets go through
// with tapered walls (the old ~100 mm tool shrank them inside out). A draft that closes a profile before the end
// gives a clear error.
const open = require('./harness.js'); const fs = require('fs');
(async () => { const { b, p, logs } = await open();
  const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/part9b.json', 'utf8')).data;
  console.log(JSON.stringify(await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); const v0 = R.geoVolume(S.body); const out = { v0: +v0.toFixed(1) };
    const reg = R.sketchRegionsOf(S.doc.features.find((x) => x.id === 'f3')); out.regions = reg.faces.length;
    const cut = { id: 'f9', type: 'extrude', name: 'Вырез1', sketch: 'f3', mode: 'cut', end: 'through', depth: 10, dir: -1, regions: null };
    S.doc.features.push(cut); R.rebuild(); out.plain = { removed: +(v0 - R.geoVolume(S.body)).toFixed(1), err: JSON.stringify(S.errors), bad: R.badEdges(S.body) };
    cut.draft = 15; R.rebuild(); out.draft15 = { removed: +(v0 - R.geoVolume(S.body)).toFixed(1), err: JSON.stringify(S.errors), bad: R.badEdges(S.body) };
    S.body.computeBoundingBox(); out.box = [S.body.boundingBox.min.y, S.body.boundingBox.max.y].map((v) => +v.toFixed(2));
    cut.draft = 44; cut.end = 'blind'; cut.depth = 3.6; R.rebuild(); out.draft44 = JSON.stringify(S.errors).slice(0, 160);
    const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(-2, -2), P(2, -2), P(2, 2), P(-2, 2)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null, draft: 40 }] });
    out.collapse = JSON.stringify(S.errors).slice(0, 160);
    return out; }, doc)));
  console.log('expect plain (checkerboard through: pieces touch at corners) refused with the zero-thickness error, removed 0; draft15 also refused (the pockets still meet at their top corners): the corner error, removed 0; draft44 on small regions: an error about the draft closing the profile (or none if they fit); collapse: the error');
  console.log(logs.join('\n')); await b.close(); })();

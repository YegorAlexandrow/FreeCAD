// «До грани» follows its face: the user's Вырез8 runs to a face of Бобышка7; when Бобышка7 grows from 5 to 8 mm
// the cut still ends on that face (testdata/arm2_user5_m66.json). A reference plane on a face follows it too.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm2_user5_m66.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((d) => { const R = window.__rezets; R.loadDoc(d); const F = (id) => R.S.doc.features.find((x) => x.id === id);
    const z0 = F('f45').target.o[2]; F('f42').depth = 8; R.rebuild(); const z1 = F('f45').target.o[2]; const err = R.S.errors;
    // A plane 5 mm off the top of Бобышка1 (z = 3); Бобышка1 becomes 4 mm.
    R.S.doc.features.splice(2, 0, { id: 'pl1', type: 'plane', name: 'Плоскость1', base: { face: { label: 'Грань', o: [0, 0, 3], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1], face: { by: 'f4', d: 3 } } }, d: 5, flip: false });
    R.rebuild(); const p0 = R.refPlane(F('pl1')).o[2]; F('f4').depth = 4; R.rebuild(); const p1 = R.refPlane(F('pl1')).o[2];
    return { z0, z1, err, p0, p1 }; }, doc)));
  console.log('expect z0 -25 → z1 -22 with no errors; plane 8 → 9');
  console.log(logs.join('\n')); await b.close(); })();

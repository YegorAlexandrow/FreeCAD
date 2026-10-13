// The user's mirror on ARM2 (testdata/arm2_user7.json): about the middle plane between the plates it copies
// Бобышка7 and Вырез8 onto the other plate; the PM offers that plane, and a new mirror takes the last plane.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm2_user7.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((d) => { const R = window.__rezets; R.loadDoc(d); const F = (id) => R.S.doc.features.find((x) => x.id === id);
    const vRight = R.geoVolume(R.S.body); F('f58').suppressed = true; R.rebuild(); const v0 = R.geoVolume(R.S.body);
    F('f58').suppressed = false; F('f58').plane = { plane: 'f57' }; R.rebuild(); const vMid = R.geoVolume(R.S.body); F('f58').feats = ['f42']; R.rebuild(); const vBossOnly = R.geoVolume(R.S.body); F('f58').feats = ['f45', 'f42']; R.rebuild(); const mid = R.refPlane(F('f57')).o[2];
    const err = R.S.errors; R.S.selectedTree = null; R.cmdPattern('mirror'); const newPlane = R.S.pm.feature.plane;
    const chips = [...document.querySelectorAll('#side .chips .chip')].map((x) => x.textContent);
    return { mid, added: +(vMid - v0).toFixed(1), bossOnly: +(vBossOnly - v0).toFixed(1), rightAdded: +(vRight - v0).toFixed(1), err, newPlane, chips }; }, doc)));
  console.log('expect mid -13.5, added > 0 and less than bossOnly (the cut copy is applied after the boss copy although picked first), newPlane {plane: f57}, chips include Плоскость1');
  console.log(logs.join('\n')); await b.close(); })();

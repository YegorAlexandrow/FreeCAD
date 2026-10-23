// Holes dragged across a plate keep the bosses picked on them: the stand-offs (rings) and the pins (discs) of a
// sketch stay those regions through every rebuild of the drag, instead of being taken over by the plate around them.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/holes-plate.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc);
    const st = () => { const f1 = R.featById('f1'); const reg = R.sketchRegionsOf(f1); const area = (id) => { const f = R.featById(id); return +[...R.selectedRegionIds(f, reg)].reduce((a, i) => a + reg.faces[i].area - reg.faces[i].holes.reduce((h, poly) => { let s = 0; for (let k = 0; k < poly.length; k++) { const p = poly[k], q = poly[(k + 1) % poly.length]; s += p[0] * q[1] - q[0] * p[1]; } return h + Math.abs(s / 2); }, 0), 0).toFixed(2); };
      return { f18: [R.featById('f18').regions.length, area('f18')], f70: [R.featById('f70').regions.length, area('f70')], vol: +R.geoVolume(S.body).toFixed(1), err: Object.keys(S.errors) }; };
    const before = st(); const sk = R.featById('f1').sk;
    for (let i = 1; i <= 30; i++) { for (const id of ['24', '25', '26', '27']) { sk.pts[id].x -= 138 / 30; sk.pts[id].y -= 39 / 30; } R.rebuild(); }
    const moved = st(); for (const id of ['24', '25', '26', '27']) sk.pts[id].y += 20; R.rebuild();
    return { before, moved, again: st() }; }, doc);
  console.log(JSON.stringify(r));
  console.log('expect f18 and f70 keep 4 regions each and the same areas (f18 99.83, f70 13.17), no errors; before the fix both became the plate (38056.87)');
  console.log(logs.join('\n')); await b.close(); })();

// The user's ARM3 sketch (testdata/arm3_user.json): the profile is defined, only the ends of the long
// construction line slide along X. The explanation says so and the view frames those ends.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm3_user.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((d) => { const R = window.__rezets; R.loadDoc(d); const f = R.S.doc.features[0]; R.startSketch(f.plane, f);
    const a = R.analyzeSketch(f.sk); const why = R.explainFree(f.sk, a);
    [...document.querySelectorAll('#side .chip')].find((x) => x.textContent.includes('не определено'))?.click();
    const r = document.getElementById('cv').getBoundingClientRect(); const ends = ['1', '3'].map((id) => { const q = f.sk.pts[id]; const s = R.toScreen(R.toWorld(f.plane, q.x, q.y)); return s.x >= 0 && s.x <= r.width && s.y >= 0 && s.y <= r.height; });
    return { dof: a.dof, why, sel: [...R.S.sel], endsOnScreen: ends }; }, doc)));
  console.log('expect dof 2, one line about the construction line with both ends free (moving along X), its ends selected and on screen');
  console.log(logs.join('\n')); await b.close(); })();

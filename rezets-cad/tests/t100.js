// A sketch point snapped to a model vertex moves with the model: ARM0's Эскиз3 rectangle sits on the inner top
// corners of the two posts of Эскиз2; moving the posts in Эскиз2 moves the rectangle and the cut with them.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm0_user.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((doc) => { const R = window.__rezets; const S = R.S;
    R.loadDoc(doc); const s2 = S.doc.features.find((f) => f.name === 'Эскиз2').sk; const s3 = () => S.doc.features.find((f) => f.name === 'Эскиз3').sk;
    const shift = (dy) => { for (const q of Object.values(s2.pts)) if (!q.fixed) q.y += dy; R.rebuild(); };
    shift(-1.23); const pt = () => { const q = s3().pts; return [q[1].x, q[1].y, q[2].x, q[2].y].map((v) => +v.toFixed(2)); };
    const out = { aligned: pt(), refs: [!!s3().pts[1].mref, !!s3().pts[2].mref], v0: +R.geoVolume(S.body).toFixed(1) };
    shift(1.23); out.moved = pt(); out.v1 = +R.geoVolume(S.body).toFixed(1); out.err = JSON.stringify(S.errors);
    shift(-3); out.moved2 = pt(); out.v2 = +R.geoVolume(S.body).toFixed(1);
    return out; }, doc)));
  console.log('expect aligned [-17.65,5,6.25,-5] with refs; moved [-17.65,6.23,6.25,-3.77], moved2 y 3.23/-6.77; same volume each time, no errors');
  console.log(logs.join('\n')); await b.close(); })();

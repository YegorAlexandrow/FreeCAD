// The user's BASE (testdata/base_d30c.json): Эскиз8 has three points taken from model corners that are no longer
// on its plane. Loading it must not carry them (and the whole profile) to some other corner 170 mm away: they stay
// where they are and are reported hanging.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/base_d30c.json', 'utf8')).data;
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); const f = R.featById('f72'); const P = (id) => [f.sk.pts[id].x, f.sk.pts[id].y].map((v) => +v.toFixed(3));
    return { p54: P('54'), p24: P('24'), p1: P('1'), lost: (S.dangling.get('f72') || []).length, err: JSON.stringify(S.errors) }; }, doc)));
  console.log('expect p54 [-153,24], p24 [-157,20], p1 [-153,20] (unmoved), lost > 0, no errors');
  console.log(logs.join('\n')); await b.close(); })();

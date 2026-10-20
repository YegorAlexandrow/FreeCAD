// The user's Деталь 9: a hole near a corner of a 60 mm plate lying in -Z. A linear pattern with direction 2 on «Ось Z»
// turns that direction toward the plate by itself, so the copies land on it (3 x 3 holes).
const open = require('./harness.js'); const fs = require('fs');
(async () => { const { b, p, logs } = await open();
  const doc = JSON.parse(JSON.parse(fs.readFileSync(__dirname + '/../testdata/part9_chunk.json', 'utf8')).s).data;
  console.log(JSON.stringify(await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); const v0 = R.geoVolume(S.body);
    S.selectedTree = 'feat:f3'; R.cmdPattern('lpattern'); const f = S.pm.feature; f.d = 18; f.n = 3; f.dir = { axis: 'x' }; R.autoFlipDir(f, 'dir');
    const box = [...document.querySelectorAll('#side label.chk')].find((x) => x.textContent.includes('Направление 2')).querySelector('input'); box.click();
    const z = [...document.querySelectorAll('#side .chip')].filter((x) => x.textContent === 'Z').pop(); z.click(); f.d2 = 18; f.n2 = 3;
    const out = { dir2: f.dir2, flip2: f.flip2, flip: f.flip }; R.okPM(); out.err = JSON.stringify(S.errors); out.removed = +(v0 - R.geoVolume(S.body)).toFixed(1); out.one = +(Math.PI * 4 * 2.4).toFixed(1); return out; }, doc)));
  console.log('expect dir2 axis z, flip2 true, flip false, no errors, removed about 8 * one (the eight copies all cut into the plate)');
  console.log(logs.join('\n')); await b.close(); })();

// A part made of separate solids exports each as its own STL (the user's ARM2, testdata/arm2_user5_m66.json).
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm2_user5_m66.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  const r = await p.evaluate((d) => { const R = window.__rezets; R.loadDoc(d); const all = R.geoVolume(R.S.body); const bs = R.splitBodies(R.S.body);
    return { all: +all.toFixed(1), bodies: bs.map((x) => +x.vol.toFixed(1)), sum: +bs.reduce((s, x) => s + x.vol, 0).toFixed(1), stlHead: R.stlText(bs[0].geo, 'ARM2 тело1').slice(0, 30) }; }, doc);
  await p.evaluate(() => document.getElementById('bStl').click()); await p.waitForTimeout(200);
  const menu = await p.evaluate(() => [...document.querySelectorAll('#menu button, #menu .item, #menu div')].map((x) => x.textContent).filter(Boolean).slice(0, 6));
  console.log(JSON.stringify({ ...r, menu })); console.log('expect several bodies whose volumes sum to the whole, a menu with «Все тела одним файлом», «Каждое тело отдельным файлом» and one line per body');
  console.log(logs.join('\n')); await b.close(); })();

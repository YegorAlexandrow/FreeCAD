// The user's ARM1 Эскиз7: the circles and the hexagon are centred on the sketch origin. Clicking the centre offers
// «Отвязать от исходной точки», which gives them their own centre.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm1_user2.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  const xy = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.editFeature(S.doc.features.find((f) => f.name === 'Эскиз7')); R.setTool('select');
    const f = S.doc.features.find((g) => g.id === S.editing); const s = R.toScreen(R.toWorld(f.plane, 0, 0)); const r = document.getElementById('cv').getBoundingClientRect(); return [r.left + s.x, r.top + s.y]; }, doc);
  await p.waitForTimeout(1000); await p.evaluate(() => { [...document.querySelectorAll('#side label.chk')].find((x) => x.textContent.includes('значки'))?.querySelector('input').click(); }); const xy2 = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const f = S.doc.features.find((g) => g.id === S.editing); const s = R.toScreen(R.toWorld(f.plane, 0, 0)); const r = document.getElementById('cv').getBoundingClientRect(); return [r.left + s.x, r.top + s.y]; });
  await p.mouse.move(xy2[0], xy2[1]); await p.mouse.down(); console.log('down', await p.evaluate(() => [...window.__rezets.S.sel].join())); await p.mouse.up(); await p.waitForTimeout(200); console.log('up', await p.evaluate(() => [...window.__rezets.S.sel].join()), xy2);
  const out = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const btn = [...document.querySelectorAll('#side button')].find((x) => x.textContent === 'Отвязать от исходной точки');
    const r = { sel: [...S.sel], button: !!btn }; btn?.click(); const sk = S.doc.features.find((g) => g.id === S.editing).sk; r.centres = [...new Set(Object.values(sk.ents).filter((e) => e.t === 'circle').map((e) => e.c))]; return r; });
  console.log(JSON.stringify(out), '\nexpect sel [p:O], button, centres one new point (not O)');
  console.log(logs.join('\n')); await b.close(); })();

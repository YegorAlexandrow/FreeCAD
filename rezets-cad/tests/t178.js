// A lost model point is repaired by dragging it onto a model corner (ARM0's Эскиз4, point 17 from an older save):
// dropped on a corner it is tied to it and no longer lost; dropped in empty space it goes back.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm0_user2.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  const info = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); const F = (n) => S.doc.features.find((f) => f.name === n); F('Бобышка1').depth = 1; F('Бобышка2').depth = 14; R.rebuild(); const f = F('Эскиз4'); R.editFeature(f);
    return { lost: !!f.sk.pts['17'].lost }; }, doc);
  await p.waitForTimeout(900);
  Object.assign(info, await p.evaluate(() => { const R = window.__rezets; const S = R.S; const f = S.doc.features.find((g) => g.name === 'Эскиз4'); const q = f.sk.pts['17']; const near = S.refs.verts.slice().sort((a, c) => Math.hypot(a[0] - q.x, a[1] - q.y) - Math.hypot(c[0] - q.x, c[1] - q.y))[0];
    const r = document.getElementById('cv').getBoundingClientRect(); const s0 = R.toScreen(R.toWorld(f.plane, q.x, q.y)), s1 = R.toScreen(R.toWorld(f.plane, near[0], near[1])); return { from: [r.left + s0.x, r.top + s0.y], to: [r.left + s1.x, r.top + s1.y], near }; }));
  await p.waitForTimeout(500);
  await p.mouse.move(...info.from); await p.mouse.down(); await p.mouse.move(info.to[0] + 3, info.to[1] + 3, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(300);
  const out = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const f = S.doc.features.find((g) => g.name === 'Эскиз4'); const q = f.sk.pts['17']; return { lost: !!q.lost, at: [+q.x.toFixed(2), +q.y.toFixed(2)], dangling: S.dangling.get(f.id) || null }; });
  console.log(JSON.stringify({ before: info.lost, near: info.near, ...out }));
  console.log('expect before true; lost false, at = near, dangling null');
  console.log(logs.join('\n')); await b.close(); })();

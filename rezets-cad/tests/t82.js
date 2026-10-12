// With every sketch already used, «Вырез» waits for a sketch: a click on it in the tree, or on its line
// in the window, opens the feature on that sketch.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm2_user5_1uw.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  await p.evaluate((d) => { const R = window.__rezets; R.loadDoc(d); R.cmdFeature('extrude', 'cut'); }, doc);
  const waiting = await p.evaluate(() => !!window.__rezets.S.pickSketch && document.querySelector('#hint')?.textContent);
  const rows = await p.$$('#side .row.child'); let target = null; for (const r of rows) if ((await r.textContent()).includes('Эскиз3')) { target = r; break; }
  await target.scrollIntoViewIfNeeded(); await target.click(); await p.waitForTimeout(300);
  const tree = await p.evaluate(() => ({ pm: window.__rezets.S.pm?.feature?.type, sketch: window.__rezets.S.pm?.feature?.sketch }));
  await p.evaluate(() => { const R = window.__rezets; R.S.pm = null; R.S.selectedTree = null; R.cmdFeature('extrude', 'add'); });
  const xy = await p.evaluate(() => { const R = window.__rezets; const f = R.S.doc.features.find((x) => x.id === 'f40'); const e = Object.values(f.sk.ents).find((x) => x.t === 'circle' || x.t === 'line'); const c = R.gp(f.sk, e.c || e.p1); const s = R.toScreen(R.toWorld(f.plane, c.x + (e.r || 0), c.y)); const r = document.getElementById('cv').getBoundingClientRect(); return { x: r.left + s.x, y: r.top + s.y }; });
  await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(300);
  const view = await p.evaluate(() => ({ pm: window.__rezets.S.pm?.feature?.type, sketch: window.__rezets.S.pm?.feature?.sketch, mode: window.__rezets.S.pm?.feature?.mode }));
  console.log(JSON.stringify({ waiting, tree, view })); console.log('expect waiting hint, tree → extrude on f8, view → extrude add on f40');
  console.log(logs.join('\n')); await b.close(); })();

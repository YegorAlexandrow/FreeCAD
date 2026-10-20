// gripper Эскиз1 by mouse: drag the R25 arc's centre and its bottom point; dimension the slot under the arc.
const open = require('./harness.js'); const fs = require('fs');
(async () => { const { b, p, logs } = await open();
  const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/gripper2.json', 'utf8')).data;
  await p.waitForTimeout(3000); await p.evaluate((doc) => { const R = window.__rezets; R.loadDoc(doc); R.editFeature(R.S.doc.features[0]); }, doc); await p.waitForTimeout(500); console.log(await p.evaluate(() => [window.__rezets.S.editing, window.__rezets.S.mode, window.__rezets.S.doc.features.map((f) => f.id).join()]));
  const scr = (id) => p.evaluate((id) => { const R = window.__rezets; const f = R.featById(R.S.editing); const q = f.sk.pts[id]; const s = R.toScreen(R.toWorld(f.plane, q.x, q.y)); const r = document.getElementById('cv').getBoundingClientRect(); return [r.left + s.x, r.top + s.y]; }, id);
  const pt = (id) => p.evaluate((id) => { const R = window.__rezets; const q = R.featById(R.S.editing).sk.pts[id]; return [+q.x.toFixed(3), +q.y.toFixed(3)]; }, id);
  const out = {}; { const [x, y] = await scr('5'); out.pick5 = await p.evaluate(([x, y]) => { const R = window.__rezets; const m = R.mouseToSketch({ clientX: x, clientY: y }); const el = document.elementFromPoint(x, y); return [m, R.pick(m), el.tagName + '.' + el.className + ' ' + (el.textContent || '').slice(0, 20)]; }, [x, y]); }
  for (const id of ['5', '1', '7', '48']) { const before = await pt(id); const [x, y] = await scr(id); await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.move(x, y - 15, { steps: 5 }); console.log(id, x, y, await p.evaluate(() => JSON.stringify([window.__rezets.S.drag && window.__rezets.S.drag.key, window.__rezets.S.hover, window.__rezets.S.tool]))); await p.mouse.move(x, y - 30, { steps: 5 }); await p.mouse.up(); out[id] = [before, await pt(id)]; await p.evaluate((doc) => { const R = window.__rezets; R.exitSketch(); R.loadDoc(doc); R.editFeature(R.S.doc.features[0]); }, doc); }
  // dimension: tool D, click point 1 then point 127, place
  await p.evaluate(() => window.__rezets.setTool('dim')); for (const id of ['1', '127']) { const [x, y] = await scr(id); await p.mouse.click(x, y); }
  const [x, y] = await scr('127'); await p.mouse.click(x + 40, y - 20); await p.waitForTimeout(300);
  out.dim = await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; return Object.values(sk.cons).filter((c) => c.refs.includes('127') && c.refs.includes('1')).map((c) => c.t + ' ' + c.v); });
  out.toasts = await p.$$eval('.toast', (els) => els.map((e) => e.textContent));
  console.log(JSON.stringify(out));
  console.log(logs.join('\n')); await b.close(); })();

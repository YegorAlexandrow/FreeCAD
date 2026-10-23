// Variables: a name changed then Tab to the value keeps the focus and what is typed there. Hole: «Редактировать точки»
// and back returns to the hole panel with its settings (the hole was dropped).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1500); const out = {};
  await p.evaluate(() => { const R = window.__rezets; R.S.doc.vars = [{ name: 'h', expr: '10' }]; R.cmdVars(); }); await p.waitForTimeout(300);
  await p.locator('#side .var-n').first().fill('hh'); await p.keyboard.press('Tab'); await p.waitForTimeout(200); await p.keyboard.press('Control+a'); await p.keyboard.type('30'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  out.vars = await p.evaluate(() => window.__rezets.S.doc.vars.map((v) => v.name + '=' + v.expr));
  await p.evaluate(() => document.querySelector('.pm-act .ok')?.click());
  out.hole = await p.evaluate(() => { const R = window.__rezets; const S = R.S; S.selectedTree = null; R.startSketch({ ...R.PLANES.top, o: [0, 32, 0] }); const sk = R.featById(S.editing).sk; sk.pts.h1 = { id: 'h1', x: 30, y: -10, free: true }; R.commitSketch(); const sid = S.editing; R.exitSketch(); S.selectedTree = 'feat:' + sid; R.cmdHole(); return { pm: S.pm?.kind || !!S.pm, id: S.pm?.feature?.id }; });
  await p.evaluate(() => { const f = window.__rezets.S.pm.feature; f.dia = 7; }); await p.locator('#side button', { hasText: 'Редактировать точки' }).click(); await p.waitForTimeout(300);
  out.inSketch = await p.evaluate(() => !!window.__rezets.S.editing);
  await p.evaluate(() => window.__rezets.exitSketch()); await p.waitForTimeout(300);
  out.back = await p.evaluate(() => ({ pm: !!window.__rezets.S.pm, dia: window.__rezets.S.pm?.feature?.dia }));
  console.log(JSON.stringify(out)); console.log('expect vars [hh=30]; hole inSketch true, back pm true dia 7');
  console.log(logs.join('\n')); await b.close(); })();

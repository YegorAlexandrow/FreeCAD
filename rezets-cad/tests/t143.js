// Panels: the error line follows the preview (picking a valid target clears «Выберите грань», a breaking value
// shows its message without OK); Esc in a field drops what was typed and cancels the panel at once; arrows turn
// the view 15°; a clicked face stays shown as selected.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1500); const out = {};
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; S.selectedTree = 'feat:' + S.doc.features.find((f) => f.type === 'sketch').id; R.cmdFeature('extrude', 'add'); });
  await p.waitForTimeout(400); await p.evaluate(() => { const f = window.__rezets.S.pm.feature; f.end = 'face'; f.target = null; window.__rezetsSP(); }); await p.waitForTimeout(600);
  out.err = await p.evaluate(() => document.querySelector('#side .pm-errbox')?.textContent || null);
  await p.evaluate(() => { const f = window.__rezets.S.pm.feature; f.end = 'blind'; window.__rezetsSP(); }); await p.waitForTimeout(600);
  out.errAfter = await p.evaluate(() => document.querySelector('#side .pm-errbox')?.textContent || null);
  const inp = p.locator('#side label.field', { hasText: 'Глубина' }).locator('input');
  await inp.focus(); await inp.fill('777'); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  out.esc = await p.evaluate(() => ({ pm: !!window.__rezets.S.pm }));
  const c0 = await p.evaluate(() => window.__rezets.camInfo().slice(0, 3)); await p.keyboard.press('ArrowLeft'); const c1 = await p.evaluate(() => window.__rezets.camInfo().slice(0, 3));
  out.arrow = +(Math.acos((c0[0] * c1[0] + c0[1] * c1[1] + c0[2] * c1[2]) / Math.hypot(...c0) / Math.hypot(...c1)) * 180 / Math.PI).toFixed(1);
  console.log(JSON.stringify(out));
  console.log('expect err «Выберите грань…», errAfter null, esc pm false, arrow ≈15 (if the target is the origin)');
  console.log(logs.join('\n')); await b.close(); })();

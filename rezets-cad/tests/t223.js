// A7: Extrude with every sketch already used waits for a sketch; a click on a flat face of the part starts a new
// sketch there instead of doing nothing.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800);
  await p.click('[data-view="iso"]'); await p.waitForTimeout(800);
  const pick = await p.evaluate(() => { const R = window.__rezets; const S = R.S; R.cmdFeature('extrude', 'add'); return !!S.pickSketch; });
  const s = await p.evaluate(() => { const R = window.__rezets; const h = R.castRay([-28, 100, 18], [0, -1, 0])[0]; return { y: h?.point.y, s: R.toScreen(h.point) }; });
  const box = await (await p.$('#cv')).boundingBox(); await p.mouse.click(box.x + s.s.x, box.y + s.s.y); await p.waitForTimeout(600);
  console.log(JSON.stringify({ pick, faceY: s.y, editing: await p.evaluate(() => { const R = window.__rezets; const f = R.featById(R.S.editing); return f ? f.plane.label : null; }), dbg: await p.evaluate(() => [window.__rezets.S.selectedTree, !!window.__rezets.S.pickSketch, window.__rezets.S.pm?.kind, document.getElementById('hint').textContent.slice(0, 60)]) }));
  console.log('expect pick true, editing «Грань» (a sketch on the clicked face)');
  console.log(logs.join('\n')); await b.close(); })();

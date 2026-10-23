// Mate pop-up: after the second pick a bar by the cursor offers the mate types, Реверс, OK and cancel.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id); const [c0, c] = R.S.doc.comps; c0.fixed = true; c.T = c0.T.slice(); c.T[12] += 150; R.asmRefresh(true); });
  await p.mouse.move(700, 450); await p.keyboard.press('f'); await p.waitForTimeout(700);
  const pts = await p.evaluate(() => { const R = window.__rezets; const cv = document.getElementById('cv').getBoundingClientRect(); const got = {};
    for (let y = cv.top + 40; y < cv.bottom - 40; y += 12) for (let x = cv.left + 40; x < cv.right - 40; x += 12) { const a = R.asmPick({ clientX: x, clientY: y }); if (a?.ent?.kind === 'plane' && Math.abs(a.ent.d[1] - 1) < 1e-6 && !got[a.comp]) got[a.comp] = [x, y]; }
    return Object.values(got); });
  await p.evaluate(() => window.__rezets.cmdMate()); await p.waitForTimeout(200);
  await p.mouse.click(...pts[0]); await p.waitForTimeout(200); const bar1 = await p.evaluate(() => !document.getElementById('mateBar').hidden);
  await p.mouse.click(...pts[1]); await p.waitForTimeout(400);
  const bar2 = await p.evaluate(() => ({ shown: !document.getElementById('mateBar').hidden, buttons: [...document.querySelectorAll('#mateBar button')].map((x) => x.textContent) }));
  await p.click('#mateBar button[title="Расстояние"]'); await p.waitForTimeout(300); const type = await p.evaluate(() => window.__rezets.S.pm.type);
  await p.click('#mateBar .ok'); await p.waitForTimeout(400); const after = await p.evaluate(() => ({ mates: window.__rezets.S.doc.mates.map((m) => m.type), bar: !document.getElementById('mateBar').hidden }));
  console.log(JSON.stringify({ n: pts.length, bar1, bar2, type, after })); console.log('expect bar1 false; bar2 shown with the types for two faces (◆ ↔ ◔), ✓ ✕; type distance; after mates [distance], bar false');
  console.log(logs.join('\n')); await b.close(); })();

// Alt+click in an assembly picks through the component in front: two plates one behind the other, the click with Alt
// lands on the far one.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id); const [c0, c] = R.S.doc.comps; c.T = c0.T.slice(); c.T[13] -= 200; R.asmRefresh(true); });
  await p.mouse.move(700, 450); await p.keyboard.press('Control+5'); await p.waitForTimeout(800); await p.keyboard.press('f'); await p.waitForTimeout(700);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const cv = document.getElementById('cv').getBoundingClientRect(); let at = null;
    for (let y = cv.top + 40; y < cv.bottom - 40 && !at; y += 10) for (let x = cv.left + 40; x < cv.right - 40 && !at; x += 10) { const a = R.asmPick({ clientX: x, clientY: y }); const b2 = R.asmPick({ clientX: x, clientY: y, altKey: true }); if (a && b2 && a.comp !== b2.comp) at = [a.comp, b2.comp]; }
    return { found: !!at, ids: at, comps: S.doc.comps.map((c) => c.id) }; });
  console.log(JSON.stringify(r)); console.log('expect found true: plain click on the near plate, Alt on the far one');
  console.log(logs.join('\n')); await b.close(); })();

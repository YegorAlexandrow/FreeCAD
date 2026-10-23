// Ctrl+C / Ctrl+V on an assembly component inserts another instance of it beside the copied one, turned the same way.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const base = S.project.docs.find((d) => d.name === 'Кронштейн'); R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(base.id); R.asmInsert(base.id); const c = S.doc.comps[1]; const q = Math.PI / 2; c.T = [Math.cos(q), Math.sin(q), 0, 0, -Math.sin(q), Math.cos(q), 0, 0, 0, 0, 1, 0, 200, 0, 0, 1]; S.asmSel = c.id; R.asmRefresh(true); });
  await p.locator('#cv').hover(); await p.keyboard.press('Control+c'); await p.keyboard.press('Control+v'); await p.waitForTimeout(300);
  const out = await p.evaluate(() => { const S = window.__rezets.S; const c = S.doc.comps.at(-1); return { n: S.doc.comps.length, name: c.name, rot: c.T.slice(0, 2).map((v) => +v.toFixed(3)), sel: S.asmSel === c.id }; });
  await p.keyboard.press('Control+z'); await p.waitForTimeout(300); out.afterUndo = await p.evaluate(() => window.__rezets.S.doc.comps.length);
  console.log(JSON.stringify(out)); console.log('expect n 3, name Кронштейн<3>, rot [0,1] (copied turn), sel true, afterUndo 2');
  console.log(logs.join('\n')); await b.close(); })();

// Interference with a component selected checks only its pairs; «Проверить всю сборку» checks all.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const wait = () => p.waitForFunction(() => !window.__rezets.S.pm?.busy, null, { timeout: 60000 });
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id); R.asmInsert(id); const [a, b2, c] = S.doc.comps; b2.T = a.T.slice(); b2.T[12] += 10; c.T = a.T.slice(); c.T[12] += 300; R.asmRefresh(true); S.asmSel = c.id; R.cmdInterference(); });
  await wait(); const sel = await p.evaluate(() => ({ n: window.__rezets.S.pm.res.length, of: window.__rezets.S.pm.only != null }));
  await p.click('#side .chip >> text=Проверить всю сборку'); await wait(); const all = await p.evaluate(() => window.__rezets.S.pm.res.length);
  console.log(JSON.stringify({ sel, all })); console.log('expect sel n 0 (the far one touches nothing) with only set; all 1 (the two overlapping)');
  console.log(logs.join('\n')); await b.close(); })();

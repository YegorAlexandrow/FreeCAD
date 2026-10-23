// The explode plays step by step: halfway through, the first step is done and the second has not started.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id); const [c0, c] = S.doc.comps;
    S.doc.explode = { on: false, steps: [{ id: 'x1', comps: [c0.id], dir: [0, 1, 0], d: 50 }, { id: 'x2', comps: [c.id], dir: [1, 0, 0], d: 80 }] }; R.asmRefresh(true); R.cmdExplode(); R.S.doc.explode.on = false; R.asmRefresh(); R.renderSide(); });
  await p.click('#side .chip >> text=Разнести'); await p.waitForTimeout(500);
  const mid = await p.evaluate(() => { const S = window.__rezets.S; return S.doc.comps.map((c) => { let t = null; window.__rezets.asmGroup.children.forEach((g) => { if (g.userData.comp === c.id) t = [g.matrix.elements[12], g.matrix.elements[13]].map((v) => Math.round(v - c.T[12 + (v === g.matrix.elements[12] ? 0 : 1)])); }); return t; }); });
  await p.waitForTimeout(1200); const end = await p.evaluate(() => ({ on: window.__rezets.S.doc.explode.on, anim: window.__rezets.S.explodeAnim ?? null }));
  console.log(JSON.stringify({ mid, end })); console.log('expect mid: first comp moved up part of 50 or all, second barely; end on true, anim null');
  console.log(logs.join('\n')); await b.close(); })();

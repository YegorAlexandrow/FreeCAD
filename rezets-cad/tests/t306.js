// A new explode step shows where it takes its components before it is added; adding it keeps them there.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id); const c = S.doc.comps[1];
    R.cmdExplode(); const y = () => { let v = null; R.asmGroup.children.forEach((g) => { if (g.userData.comp === c.id) v = Math.round(g.matrix.elements[13] - c.T[13]); }); return v; };
    const y0 = y(); S.pm.cur.comps = [c.id]; S.pm.cur.d = 40; R.asmRefresh(); const preview = y(); document.querySelector('#side .ghost-btn')?.click(); const added = y();
    return { y0, preview, added, steps: S.doc.explode.steps.length }; });
  console.log(JSON.stringify(r)); console.log('expect y0 0, preview 40, added 40, steps 1');
  console.log(logs.join('\n')); await b.close(); })();

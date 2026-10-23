// Interference in an exploded assembly is checked and drawn where the parts are assembled; the exploded view returns
// when the panel closes.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(async () => { const R = window.__rezets; const S = R.S; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id); const [c0, c] = S.doc.comps; c.T = c0.T.slice(); c.T[12] += 10; R.asmRefresh(true);
    S.doc.explode = { on: true, steps: [{ comps: [c.id], dir: [0, 1, 0], d: 100 }] }; R.asmRefresh(true);
    R.cmdInterference(); const during = S.doc.explode.on; for (let i = 0; i < 100 && S.pm?.busy; i++) await new Promise((res) => setTimeout(res, 100));
    const n = S.pm?.res?.length; document.querySelector('#side .pm .cancel')?.click(); return { during, n, after: S.doc.explode.on }; });
  console.log(JSON.stringify(r)); console.log('expect during false, n 1 (the overlapping copies), after true');
  console.log(logs.join('\n')); await b.close(); })();

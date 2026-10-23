// Mates to the assembly's own planes: a free part held by its three planes to the assembly's three planes ends at
// the origin, fully defined; the mates are listed with «Сборка» as the other side.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const base = S.project.docs.find((d) => d.name === 'Кронштейн');
    R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(base.id); const c = S.doc.comps[0]; c.fixed = false; c.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 40, 25, -10, 1];
    const o = {}; let n = 0; for (const k of ['top', 'right', 'front']) o[k] = R.tryAddMate(S.doc, { id: 'm' + n++, name: 'Совпадение' + n, type: 'coincident', a: R.stdPlaneRef(c, k), b: R.stdPlaneRef(R.ASM_ORIGIN, k), flip: true }).status;
    R.asmRefresh(true); o.pos = R.poseOf(c).t.toArray().map((v) => +v.toFixed(4)); o.dof = S.asmAnalysis.dof; o.rows = [...document.querySelectorAll('#side .row')].map((r) => r.textContent).filter((t) => t.includes('Совпадение')).slice(0, 1); return o; })));
  console.log('expect top/right/front ok, pos [0,0,0], dof 0, rows mention «Сборка»');
  console.log(logs.join('\n')); await b.close(); })();

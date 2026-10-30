// A25: an assembly says when a part in it is shown rolled back (its rollback bar left above the end of its tree).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1000);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const part = S.doc; part.rollback = Math.max(1, part.features.length - 2); const id = R.activeEntry().id;
    R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmRefresh(true); R.renderSide();
    return [...document.querySelectorAll('#side .note')].map((e) => e.textContent).filter((t) => t.includes('откате')); });
  console.log(JSON.stringify(r)); console.log('expect one note: «Кронштейн» показан в откате: без 2 последних операций…');
  console.log(logs.join('\n')); await b.close(); })();

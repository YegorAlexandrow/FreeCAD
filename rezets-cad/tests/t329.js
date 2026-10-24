// Back in an assembly from a part, the component that was selected is selected again (K27).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const part = R.activeEntry();
    const a = R.addDoc('asm', 'Сб1', R.newAsm()); R.asmInsert(part.id); R.asmInsert(part.id); const c2 = S.doc.comps[1].id; S.asmSel = c2; R.asmRefresh();
    const asmId = R.activeEntry().id; R.switchDoc(part.id); const inPart = S.asmSel; R.switchDoc(asmId); return { c2, inPart, back: S.asmSel }; });
  console.log(JSON.stringify(r)); console.log('expect inPart null, back = c2');
  console.log(logs.join('\n')); await b.close(); })();

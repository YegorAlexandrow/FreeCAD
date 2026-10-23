// Editing a part in context: another instance of the same part in the assembly follows the edit.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id); const [c0, c] = S.doc.comps; c.T = c0.T.slice(); c.T[12] += 150; R.asmRefresh(true);
    R.editInContext(c.id); const vol = () => { let v = 0; R.ctxGroup.traverse((o) => { if (o.isMesh) v = Math.max(v, R.geoVolume(o.geometry)); }); return Math.round(v); };
    const v0 = vol(); const f = S.doc.features.find((x) => x.type === 'extrude' && x.mode === 'add'); f.depth *= 2; R.rebuild(); const v1 = vol();
    return { mode: S.mode, v0, v1, body: Math.round(R.geoVolume(S.body)) }; });
  console.log(JSON.stringify(r)); console.log('expect mode part; v1 > v0 and v1 = body (the other instance shows the edit)');
  console.log(logs.join('\n')); await b.close(); })();

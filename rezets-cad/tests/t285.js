// A component marked «Не резать в разрезе» stays whole in an assembly section: no clipping, no cap.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id);
    R.toggleSection(); const a0 = S.section.area; const clipped = () => { let n = 0, k = 0; R.asmGroup.traverse((o) => { if (o.isMesh && !o.userData.sec) { n++; if (o.material.clippingPlanes?.length) k++; } }); return [k, n]; };
    const c0 = clipped(); S.doc.comps[1].noCut = true; R.asmRefresh(true); return { a0: +a0.toFixed(1), a1: +S.section.area.toFixed(1), c0, c1: clipped() }; });
  console.log(JSON.stringify(r)); console.log('expect a1 about half of a0 (one cap fewer, when both are cut), c1 has fewer clipped meshes than c0');
  console.log(logs.join('\n')); await b.close(); })();

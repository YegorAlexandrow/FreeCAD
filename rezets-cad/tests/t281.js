// Components: a suppressed one stays in the tree but is not drawn, solved or counted, and its mates rest; hiding the
// seed of a pattern leaves the copies on screen.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id);
    const meshes = () => { let n = 0; R.asmGroup.traverse((o) => { if (o.isMesh && !o.userData.sec) n++; }); return n; };
    const c = S.doc.comps[1]; const before = { comps: R.allComps(S.doc).length, meshes: meshes(), bom: R.bomRows().map((x) => x.qty) };
    c.suppressed = true; R.asmRefresh(true);
    const after = { comps: R.allComps(S.doc).length, meshes: meshes(), bom: R.bomRows().map((x) => x.qty), row: [...document.querySelectorAll('#side .row')].some((x) => x.classList.contains('supp')) };
    delete c.suppressed; S.doc.patterns = [{ id: 'p9', name: 'ЛинейныйМассив1', type: 'lin', seeds: [S.doc.comps[0].id], ref: { axis: 'x' }, n: 3, d: 80 }]; R.asmRefresh(true);
    const pat = meshes(); S.doc.comps[0].hidden = true; R.asmRefresh(true); const seedHidden = meshes();
    return { before, after, pat, seedHidden }; });
  console.log(JSON.stringify(r));
  console.log('expect before comps 2 meshes 4 bom [2]; after comps 1 meshes 2 bom [1] row true; pat 8; seedHidden 6 (copies stay); two meshes a component');
  console.log(logs.join('\n')); await b.close(); })();

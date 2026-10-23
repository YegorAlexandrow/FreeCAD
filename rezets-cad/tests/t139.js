// User-flow fixes: undo inside a new sketch stops at the sketch's start; renaming in the tree (Esc keeps the old
// name, Enter does not open the feature); OK on a failing new feature keeps its panel and leaves the tree alone;
// a new extrude panel takes the keyboard in its depth field; an assembly selection does not follow into another
// assembly; instance numbers do not repeat.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1500); const out = {};
  out.undo = await p.evaluate(() => { const R = window.__rezets; const S = R.S; R.startSketch({ ...R.PLANES.front }); const sk = R.featById(S.editing).sk;
    sk.pts.a = { id: 'a', x: 0, y: 0 }; sk.pts.b = { id: 'b', x: 10, y: 0 }; sk.ents.l = { id: 'l', t: 'line', p1: 'a', p2: 'b' }; R.commitSketch();
    R.undo(); R.undo(); R.undo(); return { editing: !!S.editing, sketchKept: !!R.featById(S.editing || 'none') }; });
  await p.evaluate(() => window.__rezets.exitSketch());
  // rename
  out.rename = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const f = S.doc.features.find((x) => x.type === 'extrude'); S.selectedTree = 'feat:' + f.id; R.renderTree(); R.renameFeature(f); return { name0: f.name, id: f.id, has: !!document.getElementById('renameInput') }; });
  await p.locator('#renameInput').fill('Новое'); await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  out.afterEsc = await p.evaluate((id) => window.__rezets.featById(id).name, out.rename.id);
  await p.evaluate((id) => { const R = window.__rezets; R.S.selectedTree = 'feat:' + id; R.renderTree(); R.renameFeature(R.featById(id)); }, out.rename.id);
  await p.locator('#renameInput').fill('Бобышка-база'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  out.afterEnter = await p.evaluate((id) => ({ name: window.__rezets.featById(id).name, pm: !!window.__rezets.S.pm }), out.rename.id);
  // OK on a failing new feature
  out.failOk = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = S.doc.features.find((x) => x.type === 'sketch'); S.selectedTree = 'feat:' + sk.id; R.cmdFeature('extrude', 'cut'); const f = S.pm?.feature; if (!f) return 'no pm'; f.end = 'face'; f.target = null; const n0 = S.doc.features.length; R.okPM(); return { pmOpen: !!S.pm, added: S.doc.features.length - n0 }; });
  await p.evaluate(() => window.__rezets.S.pm && document.querySelector('.pm-act .cancel')?.click());
  // focus on a new extrude panel
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; R.startSketch({ ...R.PLANES.top }); const sk = R.featById(S.editing).sk; const P = (id, x, y) => { sk.pts[id] = { id, x, y }; }; P('a', 0, 0); P('b', 5, 0); P('c', 5, 5); P('d', 0, 5); ['ab', 'bc', 'cd', 'da'].forEach((k) => { sk.ents[k] = { id: k, t: 'line', p1: k[0], p2: k[1] }; }); R.commitSketch(); R.exitSketch(); R.cmdFeature('extrude', 'add'); });
  await p.waitForTimeout(200); out.focus = await p.evaluate(() => document.activeElement?.tagName + ':' + document.activeElement?.closest('label')?.textContent?.slice(0, 12));
  await p.keyboard.type('35'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  out.depth = await p.evaluate(() => { const fs = window.__rezets.S.doc.features; return fs[fs.length - 1].depth; });
  // assemblies
  out.asm = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const part = S.project.docs.find((d) => d.kind === 'part');
    const a1 = R.addDoc('asm', 'Сб1', R.newAsm()); R.asmInsert(part.id); R.asmInsert(part.id); const c2 = S.doc.comps[1].id; S.asmSel = c2;
    const names1 = S.doc.comps.map((c) => c.name); S.doc.comps.splice(0, 1); R.asmInsert(part.id); const names2 = S.doc.comps.map((c) => c.name);
    R.addDoc('asm', 'Сб2', R.newAsm()); return { selInOther: S.asmSel, names1, names2 }; });
  out.empty = await p.evaluate(() => { const R = window.__rezets; const S = R.S; R.switchDoc(S.project.docs.find((d) => d.kind === 'part').id); const n0 = S.doc.features.length; R.startSketch({ ...R.PLANES.right }); R.exitSketch(); const n1 = S.doc.features.length; R.undo(); return { added: n1 - n0, back: S.doc.features.length - n0, editing: !!S.editing }; });
  console.log(JSON.stringify(out));
  console.log('expect undo editing true sketchKept true; afterEsc = name0; afterEnter name Бобышка-база pm false; failOk pmOpen true added 0; focus INPUT:Глубина...; depth 35; asm selInOther null, names2 without a repeated number; empty: added 0, undo brings it back (back 1, editing true)');
  console.log(logs.join('\n')); await b.close(); })();

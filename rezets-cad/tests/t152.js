// Assembly: undo after the component's document was deleted leaves the component out (no ghost that breaks the tree);
// Enter in the explode panel adds the step that was set up; a hidden component's vertices are not picked.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1000);
  const out = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const o = {};
    const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(-5, -5), P(5, -5), P(5, 5), P(-5, 5)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    const box = R.addDoc('part', 'Кубик', { name: 'Кубик', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Б1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null }] }, false);
    const base = S.project.docs.find((d) => d.name === 'Кронштейн');
    R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(base.id); R.asmInsert(box.id); R.asmRefresh(true);
    const asm = S.doc; const cb = asm.comps[1]; R.asmDeleteComp(cb); o.after1 = asm.comps.length;
    R.deleteDoc(box, true); o.docs = S.project.docs.some((d) => d.id === box.id);
    R.undo(); o.afterUndo = S.doc.comps.length; o.treeOk = !!document.querySelector('#side');
    return o; });
  await p.waitForTimeout(300);
  console.log(JSON.stringify(out));
  console.log('expect after1 1, docs false, afterUndo 1 (component not brought back without its document), no PAGEERROR');
  console.log(logs.join('\n')); await b.close(); })();

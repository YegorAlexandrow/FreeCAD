// E30: with the mate panel open a part can still be dragged; a plain click keeps picking for the mate.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.evaluate(() => {
    const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; };
    const a = P(-50, -30), bb = P(50, -30), c = P(50, 30), d = P(-50, 30); for (const [u, v] of [[a, bb], [bb, c], [c, d], [d, a]]) { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: v }; }
    const doc = { name: 'Коробка', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 15, dir: 1, regions: null }] };
    const ent = R.addDoc('part', 'Коробка', doc); R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(ent.id); R.asmInsert(ent.id);
    const c2 = R.S.doc.comps[1]; c2.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 150, 7, -20, 1]; R.asmRefresh(true);
    const c1 = R.S.doc.comps[0]; c1.fixed = true; const c2b = R.S.doc.comps[1];
    R.tryAddMate(R.S.doc, { id: 'm1', name: 'С1', type: 'coincident', flip: false, a: { comp: c1.id, kind: 'plane', p: [0, 15, 0], d: [0, 1, 0] }, b: { comp: c2b.id, kind: 'plane', p: [0, 0, 0], d: [0, -1, 0] } }); R.asmRefresh(true);
  });
  await p.waitForTimeout(300);
  // E34: each component's own degrees of freedom, turns and shifts apart
  L(await p.evaluate(() => [...document.querySelectorAll('#side .tree .row .meta')].slice(0, 2).map((m) => m.textContent + ' ' + m.title).join(' | ')));
  // K40: explode trails
  await p.evaluate(() => { const R = window.__rezets; const asm = R.S.doc; asm.explode = { on: true, steps: [{ id: 'x1', comps: [asm.comps[1].id], dir: [0, 1, 0], d: 40 }] }; R.asmRefresh(true); });
  L('trail', await p.evaluate(() => { const R = window.__rezets; const l = R.asmGroup.children.find((o) => o.userData.trail); return l ? l.geometry.getAttribute('position').count : 0; }));
  L(logs.join('\n')); await b.close();
})();

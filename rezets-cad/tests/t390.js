// E26: a straight edge mated to a face or an edge moves the part only as far as needed.
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
    const c1 = R.S.doc.comps[0]; c1.fixed = true;
    window.__try = (b, a, type) => { const c2 = R.S.doc.comps[1]; c2.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 150, 7, -20, 1]; R.S.doc.mates = [];
      const m = { id: 'm1', name: 'С1', type, a: { comp: c1.id, ...a }, b: { comp: c2.id, ...b } }; m.flip = R.worldEnt(m.a, R.poseOf(c1)).d.dot(R.worldEnt(m.b, R.poseOf(c2)).d) > 0; const r = R.tryAddMate(R.S.doc, m); return type + ' ' + r.status + ' move ' + Math.hypot(c2.T[12] - 150, c2.T[13] - 7, c2.T[14] + 20).toFixed(1) + ' T ' + c2.T.slice(12, 15).map((v) => v.toFixed(1)); };
  });
  const eB = { kind: 'axis', p: [-50, 15, -30], d: [1, 0, 0], edge: { t: 'line', a: [-50, 15, -30], b: [50, 15, -30] } };
  const eB2 = { kind: 'axis', p: [50, 0, -30], d: [0, 1, 0], edge: { t: 'line', a: [50, 0, -30], b: [50, 15, -30] } };
  const fA = { kind: 'plane', p: [0, 15, 0], d: [0, 1, 0] }; const eA = { kind: 'axis', p: [-50, 15, 30], d: [1, 0, 0], edge: { t: 'line', a: [-50, 15, 30], b: [50, 15, 30] } };
  for (const [nm, b2, a] of [['edgeB-faceA', eB, fA], ['vertEdgeB-faceA', eB2, fA], ['edgeB-edgeA', eB, eA], ['vertEdgeB-edgeA', eB2, eA]]) for (const t of ["coincident", "parallel"]) L(nm, await p.evaluate(([b2, a, t]) => window.__try(b2, a, t), [b2, a, t]));
  await b.close();
})();

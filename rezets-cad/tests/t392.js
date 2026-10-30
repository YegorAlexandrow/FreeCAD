// K53: a mate on a face that a part edit turned follows the face instead of breaking.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  L(JSON.stringify(await p.evaluate(() => {
    const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; };
    const a = P(-50, -30), bb = P(50, -30), c = P(30, 30), d = P(-50, 30); for (const [u, v] of [[a, bb], [bb, c], [c, d], [d, a]]) { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: v }; }
    const doc = { name: 'Клин', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 15, dir: 1, regions: null }] };
    const ent = R.addDoc('part', 'Клин', doc); const asmE = R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(ent.id); R.asmInsert(ent.id);
    const asm = R.S.doc; const [c1, c2] = asm.comps; c1.fixed = true; c2.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 150, 7, -20, 1]; R.asmRefresh(true);
    const inf = R.docInfo(ent.id); const k = inf.ents.findIndex((e) => e.kind === 'plane' && Math.abs(e.n.y) < 1e-6 && e.n.x > 0.1); const sl = inf.ents[k];
    const k2 = inf.ents.findIndex((e) => e.kind === 'plane' && e.n.y < -0.99);
    const m = { id: 'm1', name: 'Совпадение1', type: 'coincident', a: { comp: c1.id, kind: 'plane', p: sl.p.toArray(), d: sl.n.toArray(), e: k }, b: { comp: c2.id, kind: 'plane', p: inf.ents[k2].p.toArray(), d: inf.ents[k2].n.toArray(), e: k2 } };
    const r = R.tryAddMate(asm, m); R.asmRefresh(true);
    const before = sl.n.toArray().map((v) => +v.toFixed(3));
    R.switchDoc(ent.id); R.S.doc.features[0].sk.pts[c].x = 10; R.rebuild(); R.switchDoc(asmE.id);
    const m2 = R.S.doc.mates[0];
    return { add: r.status, before, broken: m2.broken || null, after: m2.a.d.map((v) => +v.toFixed(3)), unsatisfied: [...R.S.asmAnalysis.redundant].length };
  })));
  L('expect add ok, not broken, direction turned, nothing unsatisfied');
  L(logs.join('\n')); await b.close();
})();

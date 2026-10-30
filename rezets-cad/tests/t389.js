// E24: a mate is not reported as conflicting just because the part starts a quarter turn off.
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
    window.__try = (deg, type, extra) => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
      c2.T = [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 150, 15, -20, 1]; R.S.doc.mates = [];
      const r1 = R.tryAddMate(R.S.doc, { id: 'm1', name: 'С1', type: 'coincident', a: { comp: c1.id, kind: 'plane', p: [0, 15, 0], d: [0, 1, 0] }, b: { comp: c2.id, kind: 'plane', p: [0, 0, 0], d: [0, -1, 0] } });
      const r2 = R.tryAddMate(R.S.doc, { id: 'm2', name: 'С2', type, ...(extra || {}), a: { comp: c1.id, kind: 'plane', p: [50, 0, 0], d: [1, 0, 0] }, b: { comp: c2.id, kind: 'plane', p: [50, 0, 0], d: [1, 0, 0] } });
      return deg + ' ' + type + ' ' + r1.status + ' ' + r2.status; };
  });
  for (const d of [0, 45, 90, 135, 170, 179.5, 180, -100]) for (const t of ['coincident', 'parallel', 'distance']) L(await p.evaluate(([d, t]) => window.__try(d, t, t === 'distance' ? { v: 10 } : null), [d, t]));
  await b.close();
})();

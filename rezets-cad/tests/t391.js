// E3: the bore of a small hole can be picked for a mate; its rim still can, right on the edge.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.evaluate(() => {
    const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; };
    const a = P(-50, -30), bb = P(50, -30), c = P(50, 30), d = P(-50, 30); for (const [u, v] of [[a, bb], [bb, c], [c, d], [d, a]]) { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: v }; }
    const sk2 = R.newSketchData(); const o = String(sk2.nid++); sk2.pts[o] = { id: o, x: 0, y: 7.5 }; const ci = String(sk2.nid++); sk2.ents[ci] = { id: ci, t: 'circle', c: o, r: 1.5 };
    const doc = { name: 'Плита', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 15, dir: 1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: R.PLANES.front, sk: sk2 }, { id: 'f4', type: 'extrude', name: 'Вырез1', sketch: 'f3', mode: 'cut', end: 'through', depth: 100, dir: 1, both: true, regions: null }] };
    const ent = R.addDoc('part', 'Плита', doc); R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(ent.id); R.asmInsert(ent.id);
    const c2 = R.S.doc.comps[1]; c2.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 150, 7, -20, 1]; R.asmRefresh(true);
    R.look([0.35, 0.25, 1], [0, 1, 0]);
  });
  await p.waitForTimeout(900);
  const box = await (await p.$('#cv')).boundingBox();
  L('hole', await p.evaluate(() => { const R = window.__rezets; const inf = R.docInfo(R.S.doc.comps[0].doc); return inf.ents.filter((e) => e.kind === 'axis' && Math.abs(e.r - 1.5) < 1e-3).length; }));
  await p.keyboard.press('m'); await p.waitForTimeout(200);
  // the bore seen end-on is a ring; aim halfway into it from the front face
  const at = await p.evaluate(() => { const R = window.__rezets; const T = R.S.doc.comps[0].T; const s = R.toScreen(R.poseOf(R.S.doc.comps[0]).t.clone().set(T[12], T[13] + 7.5, T[14] + 30)); const s2 = R.toScreen(R.poseOf(R.S.doc.comps[0]).t.clone().set(T[12] + 1.5, T[13] + 7.5, T[14] + 30)); return { s, px: s2.x - s.x }; });
  L('hole radius px', at.px.toFixed(1));
  const res = [];
  for (const f of [0.3, 0.6, 0.97]) { const x = box.x + at.s.x + at.px * f, y = box.y + at.s.y - 0.5; await p.mouse.move(x, y); await p.waitForTimeout(150);
    res.push(f + ':' + await p.evaluate(([x, y]) => { const R = window.__rezets; const pk = R.asmPickAt({ clientX: x, clientY: y }); const h = R.S.pm.hover; return (h ? h.kind + (h.edge ? '-' + h.edge.t : '-face') : 'none') + ' face=' + (pk?.ent ? pk.ent.kind + (pk.ent.r || '') : '-'); }, [x, y])); }
  L('hover', res.join(' '));
  L(logs.join('\n')); await b.close();
})();

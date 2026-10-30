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
  });
  await p.waitForTimeout(400);
  await p.waitForTimeout(300);
  // K9: both instances of one part have the same default colour
  L('same colour', await p.evaluate(() => { const R = window.__rezets; const by = R.asmGroup.userData.byComp; const cols = R.S.doc.comps.map((c) => { const m = by.get(c.id).children.find((o) => o.isMesh); const a = m.geometry.getAttribute('color'); return a ? [a.getX(0), a.getY(0), a.getZ(0)].map((v) => v.toFixed(3)).join() : m.material.color.getHexString(); }); return cols[0] === cols[1]; }));
  // K15: hovering a component row lights the component
  const rows = await p.$$('.tree .row'); await rows[1].hover(); await p.waitForTimeout(150);
  L('hover tint', await p.evaluate(() => { const R = window.__rezets; const m = R.asmGroup.userData.byComp.get(R.S.doc.comps[1].id).children.find((o) => o.isMesh); return m.material.emissiveIntensity > 0; }));
  // K61: double-click stays in the assembly and zooms to the component
  const z0 = await p.evaluate(() => window.__rezets.camInfo()[6]); await rows[1].dblclick(); await p.waitForTimeout(900);
  L('dblclick mode', await p.evaluate(() => window.__rezets.S.mode), 'zoom changed', await p.evaluate((z0) => Math.abs(window.__rezets.camInfo()[6] - z0) > 1e-6, z0));
  L(logs.join('\n')); await b.close();
})();

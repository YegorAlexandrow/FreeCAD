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
  // E18: M inside the mate panel keeps it open
  await p.keyboard.press('m'); await p.waitForTimeout(150); await p.keyboard.press('m'); await p.waitForTimeout(150);
  L('M twice pm', await p.evaluate(() => window.__rezets.S.pm?.kind));
  await p.keyboard.press('Escape'); await p.waitForTimeout(150);
  // E21: Backspace deletes the selected mate, with an undo in the toast (K5)
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const [a, b2] = S.doc.comps; S.doc.mates.push({ id: 'm1', name: 'Расстояние1', type: 'distance', v: 40, a: { comp: a.id, kind: 'plane', p: [0, 15, 0], d: [0, 1, 0] }, b: { comp: b2.id, kind: 'plane', p: [0, 0, 0], d: [0, -1, 0] } }); S.mateSel = 'm1'; R.asmRefresh(true); });
  await p.keyboard.press('Backspace'); await p.waitForTimeout(200);
  L('after Backspace mates', await p.evaluate(() => window.__rezets.S.doc.mates.length), 'toast undo', await p.evaluate(() => [...document.querySelectorAll('.toast button, #toasts button')].map((x) => x.textContent).join(',')));
  L(logs.join('\n')); await b.close();
})();

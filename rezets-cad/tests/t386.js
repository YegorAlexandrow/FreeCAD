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
  const box = await (await p.$('#cv')).boundingBox();
  await p.keyboard.press('m'); await p.waitForTimeout(200);
  const s = await p.evaluate(() => { const R = window.__rezets; const T = R.S.doc.comps[1].T; const v = R.poseOf(R.S.doc.comps[1]).t.clone().set(T[12], T[13] + 15, T[14]); return R.toScreen(v); });
  const T0 = await p.evaluate(() => window.__rezets.S.doc.comps[1].T.slice(12, 15));
  await p.mouse.move(box.x + s.x, box.y + s.y); await p.mouse.down(); await p.mouse.move(box.x + s.x + 60, box.y + s.y + 30, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(300);
  const st = await p.evaluate(() => { const S = window.__rezets.S; return { pm: S.pm?.kind, picks: S.pm?.picks.length, T: S.doc.comps[1].T.slice(12, 15) }; });
  L('drag moved', T0.some((v, i) => Math.abs(v - st.T[i]) > 1), 'pm', st.pm, 'picks after drag', st.picks);
  await p.mouse.move(box.x + s.x + 60, box.y + s.y + 30); await p.waitForTimeout(150); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(250);
  L('click picks', await p.evaluate(() => window.__rezets.S.pm?.picks.length));
  L(logs.join('\n')); await b.close();
})();

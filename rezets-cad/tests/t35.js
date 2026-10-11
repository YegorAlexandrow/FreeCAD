// Assembly interference check against an exact overlap volume.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.evaluate(() => {
    const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; };
    const a = P(-50, -30), bb = P(50, -30), c = P(50, 30), d = P(-50, 30); for (const [u, v] of [[a, bb], [bb, c], [c, d], [d, a]]) { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: v }; }
    const doc = { name: 'Коробка', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 15, dir: 1, regions: null }] };
    const ent = R.addDoc('part', 'Коробка', doc); R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(ent.id); R.asmInsert(ent.id);
    const c2 = R.S.doc.comps[1]; c2.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 30, 5, 10, 1]; R.asmRefresh(true);
  });
  await p.keyboard.press('f'); await p.waitForTimeout(300);
  await p.click('button.tool:has-text("Пересечения")'); await p.waitForTimeout(1500);
  L('interference', await p.evaluate(() => { const pm = window.__rezets.S.pm; return JSON.stringify({ n: pm.res.length, vol: pm.res.map((r) => +r.vol.toFixed(3)), ms: Math.round(pm.ms) }); }), 'exact 35000');
  await p.screenshot({ path: 's35_interf.png' });
  // move apart -> none
  await p.keyboard.press('Escape'); await p.evaluate(() => { const R = window.__rezets; R.S.doc.comps[1].T[12] = 150; R.asmRefresh(true); });
  await p.click('button.tool:has-text("Пересечения")'); await p.waitForTimeout(800);
  L('apart', await p.evaluate(() => window.__rezets.S.pm.res.length), await p.$eval('.pm .note', (e) => e.textContent));
  // touching faces only -> none
  await p.keyboard.press('Escape'); await p.evaluate(() => { const R = window.__rezets; R.S.doc.comps[1].T[12] = 100; R.S.doc.comps[1].T[13] = 0; R.S.doc.comps[1].T[14] = 0; R.asmRefresh(true); });
  await p.click('button.tool:has-text("Пересечения")'); await p.waitForTimeout(800);
  L('touching', await p.evaluate(() => window.__rezets.S.pm.res.length));
  L(logs.join('\n')); await b.close();
})();

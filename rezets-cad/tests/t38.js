// Component patterns in an assembly.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.evaluate(() => {
    const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; };
    const a = P(0, -20), bb = P(40, -20), c = P(40, 0), d = P(0, 0); for (const [u, v] of [[a, bb], [bb, c], [c, d], [d, a]]) { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: v }; }
    const doc = { name: 'Кубик', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null }] };
    const ent = R.addDoc('part', 'Кубик', doc); R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(ent.id);
  });
  await p.locator('.row', { hasText: 'Кубик<1>' }).click();
  await p.click('button.tool:has-text("Массив")'); await p.waitForTimeout(300);
  await p.fill('#pmStep', '60'); await p.press('#pmStep', 'Tab'); await p.fill('#pmCount', '4'); await p.press('#pmCount', 'Tab'); await p.waitForTimeout(300);
  await p.click('#corner .ok'); await p.waitForTimeout(500);
  L('linear', await p.evaluate(() => { const R = window.__rezets; return JSON.stringify({ n: R.allComps(R.S.doc).length, xs: R.allComps(R.S.doc).map((c) => c.T[12]), bom: R.bomRows().map((r) => r.qty), interf: R.asmInterference(R.S.doc).length }); }), 'expect 4 at x 0,60,120,180');
  L('tree', await p.$$eval('.tree .row .nm', (els) => els.map((e) => e.textContent).join(', ')));
  await p.keyboard.press('f'); await p.waitForTimeout(400); await p.screenshot({ path: 's38_lin.png' });
  // circular about Y, 6 copies, starting from the seed moved to x=50
  await p.evaluate(() => { const R = window.__rezets; R.S.doc.patterns = []; R.S.doc.comps[0].T[12] = 50; R.S.asmSel = R.S.doc.comps[0].id; R.asmRefresh(true); });
  await p.click('button.tool:has-text("Круговой")'); await p.waitForTimeout(300);
  await p.fill('#pmCount', '6'); await p.press('#pmCount', 'Enter'); await p.waitForTimeout(500);
  L('circular', await p.evaluate(() => { const R = window.__rezets; const cs = R.allComps(R.S.doc); return JSON.stringify(cs.map((c) => [c.T[12], c.T[14]].map((v) => +v.toFixed(3)))); }), 'expect 6 on a circle r=50 about Y, no interference:', await p.evaluate(() => window.__rezets.asmInterference(window.__rezets.S.S ? 0 : window.__rezets.S.doc).length));
  await p.keyboard.press('f'); await p.waitForTimeout(400); await p.click('[data-view="iso"]'); await p.waitForTimeout(600); await p.screenshot({ path: 's38_circ.png' });
  // undo, reload persistence
  await p.waitForTimeout(800); await p.reload(); await p.waitForFunction(() => window.__rezets?.S.project, null, { timeout: 30000 }); await p.waitForTimeout(2000);
  L('after reload', await p.evaluate(() => { const R = window.__rezets; return R.allComps(R.S.doc).length; }));
  L(logs.join('\n')); await b.close();
})();

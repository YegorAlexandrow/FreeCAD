// Section view on the sample part and in an assembly.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  await p.click('[data-view="iso"]'); await p.waitForTimeout(600);
  await p.click('#bSection'); await p.waitForTimeout(500); await p.screenshot({ path: 's43_front.png' });
  await p.locator('#sectionBar button', { hasText: 'Справа' }).click(); await p.waitForTimeout(300);
  await p.fill('#sectionBar .num', '20'); await p.press('#sectionBar .num', 'Enter'); await p.waitForTimeout(400); await p.screenshot({ path: 's43_right.png' });
  console.log('section', await p.evaluate(() => JSON.stringify(window.__rezets.S.section)));
  await p.locator('#sectionBar button', { hasText: 'Спереди' }).click(); await p.waitForTimeout(300); console.log('front area', await p.evaluate(() => window.__rezets.S.section.area));
  console.log(logs.join('\n')); await b.close();
})();
// assembly: two overlapping boxes, section through both
(async () => {
  const { b, p, logs } = await open();
  await p.evaluate(() => {
    const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; };
    const a = P(-50, -30), bb = P(50, -30), c = P(50, 30), d = P(-50, 30); for (const [u, v] of [[a, bb], [bb, c], [c, d], [d, a]]) { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: v }; }
    const doc = { name: 'Коробка', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 15, dir: 1, regions: null }] };
    const ent = R.addDoc('part', 'Коробка', doc); R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(ent.id); R.asmInsert(ent.id);
    const c2 = R.S.doc.comps[1]; c2.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 30, 0, 1]; R.asmRefresh(true);
  });
  await p.click('[data-view="iso"]'); await p.waitForTimeout(600); await p.click('#bSection'); await p.waitForTimeout(500);
  console.log('asm front area', await p.evaluate(() => window.__rezets.S.section.area), 'expect 2*100*15 = 3000');
  await p.screenshot({ path: 's43_asm.png' }); console.log(logs.join('\n')); await b.close();
})();

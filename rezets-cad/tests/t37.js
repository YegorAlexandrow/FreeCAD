// Mass properties of a part and an assembly, bill of materials.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.evaluate(() => {
    const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; };
    const a = P(0, -60), bb = P(100, -60), c = P(100, 0), d = P(0, 0); for (const [u, v] of [[a, bb], [bb, c], [c, d], [d, a]]) { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: v }; }
    const doc = { name: 'Брусок', nid: 10, rollback: null, material: 'steel', features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null }] };
    R.addDoc('part', 'Брусок', doc);
  });
  await p.click('button.tool:has-text("Масса")'); await p.waitForTimeout(400);
  L('part', await p.$$eval('.pm .kv', (els) => els.map((e) => e.textContent).join(' | ')), '| expect 60000 мм³ steel 471 г, centre (50; 5; 30)');
  await p.selectOption('#pmMat', 'alu'); await p.waitForTimeout(300);
  L('alu', await p.$eval('.pm .kv', (e) => e.textContent), 'expect 162 г');
  await p.screenshot({ path: 's37_mass.png' });
  await p.keyboard.press('Escape');
  // assembly with 3 copies -> BOM qty 3
  await p.evaluate(() => { const R = window.__rezets; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id); R.asmInsert(id); });
  await p.click('button.tool:has-text("Масса")'); await p.waitForTimeout(400);
  L('asm', await p.$$eval('.pm .kv', (els) => els.slice(0, 2).map((e) => e.textContent).join(' | ')), 'expect 486 г');
  await p.keyboard.press('Escape');
  await p.click('button.tool:has-text("Спецификация")'); await p.waitForTimeout(300);
  L('bom', JSON.stringify(await p.$eval('#modal textarea', (e) => e.value)));
  L(logs.join('\n')); await b.close();
})();

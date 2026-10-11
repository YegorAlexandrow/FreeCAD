// Variables in sketch dimensions and feature parameters.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.evaluate(() => {
    const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; };
    const a = P(0, 0), bb = P(50, 0), c = P(50, -30), d = P(0, -30); const L = [[a, bb], [bb, c], [c, d], [d, a]].map(([u, v]) => { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: v }; return id; });
    let n = 100; const add = (c) => { c.id = String(n++); R.tryAddConstraint(sk, c); }; add({ t: 'horizontal', refs: [L[0]] }); add({ t: 'horizontal', refs: [L[2]] }); add({ t: 'vertical', refs: [L[1]] }); add({ t: 'vertical', refs: [L[3]] });
    add({ t: 'dist', refs: [a, bb], v: 50 }); add({ t: 'dist', refs: [bb, c], v: 30 }); sk.nid = n;
    const doc = { name: 'Пар', nid: 10, rollback: null, vars: [{ name: 'L', expr: '80' }, { name: 'wall', expr: '3' }], features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null }] };
    R.addDoc('part', 'Пар', doc);
  });
  const vol = () => p.evaluate(() => +window.__rezets.geoVolume(window.__rezets.S.body).toFixed(3));
  L('start', await vol(), 'expect 15000');
  // dimension expression via the dimension editor
  await p.locator('.row', { hasText: 'Эскиз1' }).dblclick(); await p.waitForTimeout(600);
  await p.locator('.dimlbl', { hasText: /^50$/ }).dblclick(); await p.waitForTimeout(200);
  await p.fill('#dimInput', 'L'); await p.press('#dimInput', 'Enter'); await p.waitForTimeout(300);
  L('dim label', await p.$$eval('.dimlbl', (els) => els.map((e) => e.textContent).join(' ')));
  await p.click('#corner .ok'); await p.waitForTimeout(500);
  // feature depth as expression
  await p.locator('.row', { hasText: 'Бобышка1' }).dblclick(); await p.waitForTimeout(400);
  await p.fill('#pmDepth', 'wall*4'); await p.press('#pmDepth', 'Enter'); await p.waitForTimeout(800);
  L('after exprs', await vol(), 'expect 80*30*12 =', 80 * 30 * 12, await p.evaluate(() => JSON.stringify(window.__rezets.S.doc.features[1].exprs)));
  // change the variables in the panel
  await p.locator('.row', { hasText: 'Переменные' }).click(); await p.waitForTimeout(300);
  const ex = p.locator('.var-e'); await ex.nth(0).fill('100'); await ex.nth(0).press('Enter'); await p.waitForTimeout(500); await ex.nth(1).fill('L/20'); await ex.nth(1).press('Enter'); await p.waitForTimeout(800);
  L('after var change', await vol(), 'expect 100*30*20 =', 100 * 30 * 20, await p.$$eval('.var-v', (els) => els.map((e) => e.textContent).join(',')));
  await p.screenshot({ path: 's41_vars.png' });
  // bad expression
  await ex.nth(1).fill('foo*2'); await ex.nth(1).press('Enter'); await p.waitForTimeout(500);
  L('bad', await p.$$eval('.var-v', (els) => els.map((e) => e.textContent).join(',')), await p.$eval('.toast.err', (e) => e.textContent).catch(() => 'no toast'));
  // undo restores
  await p.keyboard.press('Escape'); await p.keyboard.press('Control+z'); await p.waitForTimeout(600); L('undo', await vol());
  L(logs.join('\n')); await b.close();
})();

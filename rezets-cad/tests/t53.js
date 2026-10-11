// Mates: reverse from the tree menu, edit (type and value), cancel of an edit keeps the mate.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.evaluate(() => {
    const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; };
    const a = P(-50, -30), bb = P(50, -30), c = P(50, 30), d = P(-50, 30); for (const [u, v] of [[a, bb], [bb, c], [c, d], [d, a]]) { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: v }; }
    const doc = { name: 'Коробка', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 15, dir: 1, regions: null }] };
    const ent = R.addDoc('part', 'Коробка', doc); R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(ent.id); R.asmInsert(ent.id);
    R.S.doc.comps[1].T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 150, 40, -20, 1]; R.asmRefresh(true);
    R.cmdMate(); const pm = R.S.pm; pm.picks = [{ comp: R.S.doc.comps[0].id, kind: 'plane', p: [0, 15, 0], d: [0, 1, 0] }, { comp: R.S.doc.comps[1].id, kind: 'plane', p: [0, 0, 0], d: [0, -1, 0] }]; R.asmRefresh(true);
  });
  const pose = () => p.evaluate(() => { const R = window.__rezets; const T = R.S.doc.comps[1].T; return { up: +T[5].toFixed(3), t: T.slice(12, 15).map((v) => +v.toFixed(3)), mates: R.S.doc.mates.map((m) => `${m.name}:${m.type}:${m.flip ? 'flip' : '-'}${m.v != null ? ':' + m.v + ':s' + m.side : ''}`).join(','), pm: !!R.S.pm }; });
  await p.click('#side .chip:has-text("Совпадение")'); await p.waitForTimeout(200);
  await p.evaluate(() => window.__rezets.okPM()); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  L('stacked  ', JSON.stringify(await pose()), 'expect up 1, y 15');
  await p.locator('#side .row', { hasText: 'Совпадение1' }).click({ button: 'right' }); await p.waitForTimeout(150);
  L('menu', await p.$$eval('#menu button', (els) => els.map((e) => e.textContent).filter(Boolean).join(' | ')));
  await p.locator('#menu button', { hasText: 'Реверс' }).click(); await p.waitForTimeout(300);
  L('reversed ', JSON.stringify(await pose()), 'expect up -1, y 15 (turned over onto the face)');
  await p.locator('#side .row', { hasText: 'Совпадение1' }).dblclick(); await p.waitForTimeout(300);
  L('edit pm', await p.$eval('#side .pm-h', (e) => e.textContent), await p.$$eval('#side .pm .chip', (els) => els.map((e) => e.textContent).join(' | ')));
  await p.locator('#side .chip', { hasText: 'Расстояние' }).click(); await p.waitForTimeout(200);
  await p.fill('#mateVal', '10'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  L('after edit', JSON.stringify(await pose()), 'expect one distance mate 10');
  await p.locator('#side .row', { hasText: 'Расстояние' }).dblclick(); await p.waitForTimeout(300);
  await p.fill('#mateVal', '-2'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  L('minus 2   ', JSON.stringify(await pose()), 'expect distance 2 on the other side: y 13');
  await p.locator('#side .row', { hasText: 'Расстояние' }).dblclick(); await p.waitForTimeout(300);
  await p.fill('#mateVal', '0'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  L('zero      ', JSON.stringify(await pose()), 'expect y 15');
  await p.locator('#side .row', { hasText: 'Расстояние' }).dblclick(); await p.waitForTimeout(300);
  await p.locator('#side .chip', { hasText: 'Реверс' }).click(); await p.waitForTimeout(200);
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  L('cancelled', JSON.stringify(await pose()), 'expect unchanged distance mate');
  L(logs.join('\n')); await b.close();
})();

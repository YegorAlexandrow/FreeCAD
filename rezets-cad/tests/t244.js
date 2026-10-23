// S0-1: a right click in a sketch on a line opens a menu with its relations, construction, dimension and delete;
// on empty space, the drawing tools and leaving the sketch.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(0, 0), c = P(30, 3); sk.ents.l = { id: 'l', t: 'line', p1: a, p2: c };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); });
  await p.waitForTimeout(300); const box = await (await p.$('#cv')).boundingBox();
  const s = await p.evaluate(() => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, 15, 1.5)); });
  await p.mouse.click(box.x + s.x, box.y + s.y, { button: 'right' }); await p.waitForTimeout(200); const onLine = await p.$$eval('#menu button', (e) => e.map((x) => x.textContent));
  await p.keyboard.press('Escape'); await p.evaluate(() => { window.__rezets.S.sel.clear(); });
  await p.mouse.click(box.x + 60, box.y + 60, { button: 'right' }); await p.waitForTimeout(200); const empty = await p.$$eval('#menu button', (e) => e.map((x) => x.textContent));
  console.log(JSON.stringify({ onLine, empty })); console.log('expect onLine with Горизонтально, Вспомогательная, Размер, Удалить; empty with Линия and Выйти из эскиза');
  console.log(logs.join('\n')); await b.close(); })();

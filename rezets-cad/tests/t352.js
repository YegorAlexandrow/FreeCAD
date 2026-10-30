// S0-47: a right click where a point sits on a line offers the line too («Выбрать другой», SolidWorks' Select Other).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; };
    P('a', 0, 0); P('b', 20, 0); P('m', 10, 0); sk.ents.A = { id: 'A', t: 'line', p1: 'a', p2: 'b' }; sk.cons.k = { id: 'k', t: 'online', refs: ['m', 'A'] }; sk.pts.m.free = true; sk.nid = 100;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); R.setTool('select'); });
  await p.waitForTimeout(400); const box = await (await p.$('#cv')).boundingBox();
  const s = await p.evaluate(() => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, 10, 0)); });
  await p.mouse.click(box.x + s.x, box.y + s.y, { button: 'right' }); await p.waitForTimeout(200);
  const items = await p.evaluate(() => [...document.querySelectorAll('#menu button, #menu .mi, #menu div')].map((e) => e.textContent).filter((t) => t.startsWith('Выбрать другой')));
  const sel0 = await p.evaluate(() => [...window.__rezets.S.sel]);
  await p.locator('#menu >> text=Выбрать другой: Линия').first().click(); await p.waitForTimeout(200);
  const sel1 = await p.evaluate(() => [...window.__rezets.S.sel]);
  console.log(JSON.stringify({ items: [...new Set(items)], sel0, sel1 })); console.log('expect items [«Выбрать другой: Линия», «Выбрать другой: Ось X»] (the line lies on the axis), sel0 [p:m], sel1 [e:A]');
  console.log(logs.join('\n')); await b.close(); })();

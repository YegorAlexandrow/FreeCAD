// C37: the dimension field follows its dimension when the view zooms.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(0, 0), c = P(40, 0); sk.ents.l0 = { id: 'l0', t: 'line', p1: a, p2: c }; sk.cons.d = { id: 'd', t: 'dist', refs: [a, c], v: 40 };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); });
  await p.waitForTimeout(400); await p.locator('.dimlbl').first().dblclick(); await p.waitForTimeout(200);
  const pos = () => p.evaluate(() => { const e = document.querySelector('.dimedit'), l = document.querySelector('.dimlbl'); const a = e.getBoundingClientRect(), b = l.getBoundingClientRect(); return Math.round(Math.hypot(a.x + a.width / 2 - b.x - b.width / 2, a.y + a.height / 2 - b.y - b.height / 2)); });
  const d0 = await pos(); const box = await (await p.$('#cv')).boundingBox(); await p.mouse.move(box.x + 200, box.y + 200); await p.mouse.wheel(0, -600); await p.waitForTimeout(600);
  console.log(JSON.stringify({ d0, d1: await pos(), open: await p.evaluate(() => !!document.querySelector('.dimedit')) }));
  console.log('expect d0 and d1 both small (the field sits on the label), open true');
  console.log(logs.join('\n')); await b.close(); })();

// C11: the free-geometry notes pick out their geometry on click, and a button shows the ones past the first five.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    for (let i = 0; i < 7; i++) { const a = P(i * 10, 0), c = P(i * 10 + 5, 8); sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: c }; }
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); });
  await p.waitForTimeout(300); const notes0 = await p.$$eval('#side .note[title]', (e) => e.length); const more = await p.$eval('#side', (e) => [...e.querySelectorAll('.chip')].map((x) => x.textContent).find((t) => t.startsWith('Ещё')) || null);
  await p.locator('#side .note[title]').nth(2).click(); const sel = await p.evaluate(() => [...window.__rezets.S.sel]);
  await p.locator('#side .chip', { hasText: 'Ещё' }).click(); const notes1 = await p.$$eval('#side .note[title]', (e) => e.length);
  console.log(JSON.stringify({ notes0, more, sel, notes1 }));
  console.log('expect notes0 5, more «Ещё 2», sel [e:l2], notes1 7');
  console.log(logs.join('\n')); await b.close(); })();

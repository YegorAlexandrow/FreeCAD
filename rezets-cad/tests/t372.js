// S0-29: a radius or diameter dimension's own menu (right click on it) switches it between radius and diameter.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); sk.pts.o = { id: 'o', x: 0, y: 0 }; sk.ents.C = { id: 'C', t: 'circle', c: 'o', r: 5 }; sk.cons.d = { id: 'd', t: 'diam', refs: ['C'], v: 10, pos: [8, 8] }; sk.nid = 50;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); });
  await p.waitForTimeout(500); await p.locator('.dimlbl').first().click({ button: 'right' }); await p.waitForTimeout(150);
  await p.locator('#menu button', { hasText: 'Показать радиус' }).click(); await p.waitForTimeout(200);
  const r = await p.evaluate(() => { const c = window.__rezets.featById('f1').sk.cons.d; return [c.t, c.v, document.querySelector('.dimlbl')?.textContent]; });
  console.log(JSON.stringify(r)); console.log('expect ["rad",5,"R5"]'); console.log(logs.join('\n')); await b.close(); })();

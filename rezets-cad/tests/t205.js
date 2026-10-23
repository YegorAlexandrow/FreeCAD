// N43: opening an extrusion whose sketch is missing from the file shows the panel with the error, no page error.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'nope', mode: 'add', end: 'blind', depth: 5, dir: 1, regions: null }] }); R.editFeature(R.featById('f2')); });
  await p.waitForTimeout(600);
  console.log(JSON.stringify({ errs, err: await p.evaluate(() => window.__rezets.S.errors.f2), pm: await p.evaluate(() => !!window.__rezets.S.pm), toast: await p.evaluate(() => document.querySelector('.toast')?.textContent) }));
  console.log('expect errs [], err «Эскиз не найден», pm false with a toast that the sketch is missing');
  console.log(logs.join('\n')); await b.close(); })();

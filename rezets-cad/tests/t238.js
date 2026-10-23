// H5: fields take units after a number: 25 мм, 2,5 см, 1 in, 90°, 2m; a variable named m still works with a space.
// expect 25, 25, 25.4, 90, 2000, 6, 6, 20, 10, 3
const open = require('./harness.js');
(async () => { const { b, p } = await open(); await p.waitForTimeout(500);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const v = { m: 3, a: 2 }; return ['25 мм', '2,5 см', '1 in', '90°', '2m', '2 * m', 'a*3мм', '10mm+1cm', 'max(1 см, 5)', '3'].map((x) => [x, R.evalWith(x, v)]); }))); await b.close(); })();

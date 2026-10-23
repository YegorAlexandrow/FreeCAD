// N40/N41: a comma inside a function call separates arguments, elsewhere it is the decimal mark.
// expect max 20, min 10, max(a,20) 20, 2,5 = 2.5, ,5 = 0.5, 5, 2.5, 2, 10, 5.5, 10
const open = require('./harness.js');
(async () => { const { b, p } = await open(); await p.waitForTimeout(500);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const v = { a: 10 }; return ['max(10,20)', 'min(10,20)', 'max(a,20)', '2,5', ',5', '2,5*2', '(2,5)', 'max(1.5, 2)', '10,', 'sqrt(16)+1,5', 'max(2,5*2, 3)'].map((x) => [x, R.evalWith(x, v)]); })));
  await b.close(); })();

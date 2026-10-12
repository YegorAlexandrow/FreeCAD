// Decimal commas and points are both accepted in number fields, also as ",5" and "1,".
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(await p.evaluate(() => ['1,5', '-1,5', ',5', '1,', '1.', '.5', '10,25+2', '2*1,5'].map((s) => s + '=' + window.__rezets.evalWith(s, {})).join('  ')));
  console.log('expect 1.5 -1.5 0.5 1 1 0.5 12.25 3'); console.log(logs.join('\n')); await b.close(); })();

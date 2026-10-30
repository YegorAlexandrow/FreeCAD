// P0-35: «Что неправильно» over the tree lists what is wrong in the part (errors, hanging references, warnings),
// each with a way to it.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/part12-sketch14.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate((doc) => { const R = window.__rezets; R.loadDoc(doc); R.rebuild(); R.renderTree(); }, doc); await p.waitForTimeout(300);
  const btn = await p.locator('#side .whatswrong').textContent(); await p.locator('#side .whatswrong').click(); await p.waitForTimeout(150);
  const items = await p.evaluate(() => [...document.querySelectorAll('#menu button')].map((e) => e.textContent));
  console.log(JSON.stringify({ btn, items })); console.log('expect «Что неправильно: 4 предупреждения» and four items: Бобышки 4, 7, 8, 10 each leave one more separate body');
  console.log(logs.join('\n')); await b.close(); })();

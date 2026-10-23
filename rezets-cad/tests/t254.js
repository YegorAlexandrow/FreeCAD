// P0-19: pointing at a feature in the tree lights its faces; leaving the row puts them out.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800);
  await p.locator('#side .row', { hasText: 'Бобышка2' }).hover(); await p.waitForTimeout(300); const on = await p.evaluate(() => window.__rezets.originCount());
  await p.mouse.move(700, 400); await p.locator('#side .sec-h').first().hover(); await p.waitForTimeout(300); const off = await p.evaluate(() => window.__rezets.originCount());
  console.log(JSON.stringify({ on, off })); console.log('expect on > 0, off 0');
  console.log(logs.join('\n')); await b.close(); })();

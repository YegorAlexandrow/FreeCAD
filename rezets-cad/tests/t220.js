// A16: the toolbar button of the operation whose panel is open looks pressed, and stops when the panel closes.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800);
  await p.locator('button.tool:has-text("Оболочка")').click(); await p.waitForTimeout(300); const a = await p.$$eval('button.tool[aria-pressed=true]', (e) => e.map((x) => x.textContent));
  await p.keyboard.press('Escape'); await p.waitForTimeout(300); const c = await p.$$eval('button.tool[aria-pressed=true]', (e) => e.map((x) => x.textContent));
  console.log(JSON.stringify({ a, c })); console.log('expect a [Оболочка], c []');
  console.log(logs.join('\n')); await b.close(); })();

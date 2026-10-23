// S0-43/P0-30: Enter with nothing open repeats the last part operation started from the toolbar.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800);
  await p.click('button.tool:has-text("Оболочка")'); await p.waitForTimeout(300); await p.keyboard.press('Escape'); await p.waitForTimeout(300); const closed = await p.evaluate(() => !window.__rezets.S.pm);
  await p.mouse.move(700, 400); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  console.log(JSON.stringify({ closed, again: await p.evaluate(() => window.__rezets.S.pm?.feature?.type) })); console.log('expect closed true, again shell');
  console.log(logs.join('\n')); await b.close(); })();

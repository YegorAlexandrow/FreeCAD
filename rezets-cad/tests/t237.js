// G2/G3: Z zooms out, Shift+Z in; a double click of the middle button fits the model.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800);
  const z = () => p.evaluate(() => window.__rezets.camInfo()[6]); const z0 = await z();
  await p.mouse.move(700, 400); await p.keyboard.press('z'); const z1 = await z(); await p.keyboard.press('Shift+Z'); await p.keyboard.press('Shift+Z'); const z2 = await z();
  await p.mouse.click(700, 400, { button: 'middle' }); await p.mouse.click(700, 400, { button: 'middle' }); await p.waitForTimeout(600); const z3 = await z();
  console.log(JSON.stringify({ out: z1 < z0, in: z2 > z0, fit: Math.abs(z3 - z0) / z0 < 0.05 })); console.log('expect all true');
  console.log(logs.join('\n')); await b.close(); })();

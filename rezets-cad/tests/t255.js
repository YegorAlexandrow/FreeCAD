// P0-10: Ctrl+2 turns the view to the back, Ctrl+6 to the bottom; Space opens a menu of the eight orientations.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800); await p.mouse.move(700, 400);
  const dir = () => p.evaluate(() => { const c = window.__rezets.camInfo(); const d = [c[0] - c[3], c[1] - c[4], c[2] - c[5]]; const l = Math.hypot(...d); return d.map((v) => Math.round(v / l)); });
  await p.keyboard.press('Control+2'); await p.waitForTimeout(1500); const back = await dir(); await p.keyboard.press('Control+6'); await p.waitForTimeout(1500); const bottom = await dir();
  await p.keyboard.press(' '); await p.waitForTimeout(200); const menu = await p.$$eval('#menu button', (e) => e.length);
  console.log(JSON.stringify({ back, bottom, menu })); console.log('expect back [0,0,-1], bottom [0,-1,0], menu 8');
  console.log(logs.join('\n')); await b.close(); })();

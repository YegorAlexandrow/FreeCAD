// The view bar lights the standard view the model is seen from and shows the keys; it goes dark after a turn.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const lit = () => p.evaluate(() => [...document.querySelectorAll('#viewbar button[aria-pressed="true"]')].map((x) => x.dataset.view));
  await p.mouse.move(700, 450); await p.keyboard.press('Control+5'); await p.waitForTimeout(700); const top = await lit();
  await p.mouse.move(800, 500); await p.mouse.down(); await p.mouse.move(830, 520); await p.mouse.up(); await p.waitForTimeout(300); const turned = await lit();
  await p.keyboard.press('Control+7'); await p.waitForTimeout(700); const iso = await lit();
  const titles = await p.evaluate(() => [...document.querySelectorAll('#viewbar button')].map((x) => x.title).slice(0, 4));
  console.log(JSON.stringify({ top, turned, iso, titles })); console.log('expect top [top], turned [], iso [iso], titles with Ctrl keys');
  console.log(logs.join('\n')); await b.close(); })();

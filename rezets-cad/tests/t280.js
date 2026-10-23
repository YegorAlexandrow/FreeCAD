// Menus work from the keyboard (arrows, Enter, Esc); a dialog takes the focus, keeps Tab inside and gives the focus
// back when Esc closes it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const foc = () => p.evaluate(() => document.activeElement?.textContent || document.activeElement?.tagName);
  await p.click('#bFile'); await p.waitForTimeout(150); const f0 = await foc(); await p.keyboard.press('ArrowDown'); const f1 = await foc(); await p.keyboard.press('ArrowUp'); await p.keyboard.press('ArrowUp'); const fl = await foc();
  await p.keyboard.press('Enter'); await p.waitForTimeout(200); const sub = await p.evaluate(() => [...document.querySelectorAll('#menu button')].map((x) => x.textContent.trim()));
  await p.keyboard.press('Escape'); const closed = await p.evaluate(() => document.getElementById('menu').hidden);
  await p.evaluate(() => window.__rezets.deleteDoc(window.__rezets.activeEntry())); await p.waitForTimeout(150);
  const dlg = await p.evaluate(() => ({ role: document.querySelector('#modal .mbox').getAttribute('role'), focus: document.activeElement.textContent, inside: !!document.activeElement.closest('#modal') }));
  await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); const still = await p.evaluate(() => !!document.activeElement.closest('#modal'));
  await p.keyboard.press('Escape'); const gone = await p.evaluate(() => document.getElementById('modal').hidden);
  console.log(JSON.stringify({ f0, f1, fl, sub, closed, dlg, still, gone }));
  console.log('expect f0 first item, f1 second, fl the last («Оформление…»), sub the three themes, closed true; dlg dialog with focus inside; still true; gone true');
  console.log(logs.join('\n')); await b.close(); })();

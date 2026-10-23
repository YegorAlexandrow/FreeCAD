// Display styles from the view bar: hidden lines removed and wireframe; picking a face still works in both.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.mouse.move(700, 450); await p.keyboard.press('f'); await p.waitForTimeout(1200); const out = {};
  for (const [label, key] of [['Без невидимых линий', 'hlr'], ['Каркас', 'wire'], ['Тонированный с рёбрами', 'shaded']]) {
    await p.click('#bDisplay'); await p.click(`#menu button >> text=${label}`); await p.waitForTimeout(300);
    if (process.env.SHOT) await p.screenshot({ path: process.env.SHOT + key + '.png', clip: { x: 272, y: 150, width: 1128, height: 690 } });
    out[key] = await p.evaluate(() => { const R = window.__rezets; const r = document.getElementById('cv').getBoundingClientRect(); let picked = false; for (let y = r.top + 200; y < r.bottom - 100 && !picked; y += 20) for (let x = r.left + 200; x < r.right - 200 && !picked; x += 30) if (R.partPickAt({ clientX: x, clientY: y })?.face) picked = true; return { display: R.S.display, picked }; }); }
  console.log(JSON.stringify(out)); console.log('expect each mode set and a face picked in each');
  console.log(logs.join('\n')); await b.close(); })();

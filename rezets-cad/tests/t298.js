// A plane under the cursor says its name next to it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [] }); });
  await p.mouse.move(700, 450); await p.keyboard.press('Control+1'); await p.waitForTimeout(700);
  const at = await p.evaluate(() => { const R = window.__rezets; const r = document.getElementById('cv').getBoundingClientRect(); for (let y = r.top + 100; y < r.bottom - 50; y += 20) for (let x = r.left + 100; x < r.right - 100; x += 20) { const h = R.partPickAt({ clientX: x, clientY: y }); if (h?.plane) return [x, y, h.plane]; } return null; });
  await p.mouse.move(at[0], at[1]); await p.waitForTimeout(200); const tip = await p.evaluate(() => { const t = document.getElementById('hoverTip'); return t.hidden ? null : t.textContent; });
  await p.mouse.move(5, 500); await p.waitForTimeout(200);
  console.log(JSON.stringify({ plane: at[2], tip })); console.log('expect tip «Спереди» for the front plane');
  console.log(logs.join('\n')); await b.close(); })();

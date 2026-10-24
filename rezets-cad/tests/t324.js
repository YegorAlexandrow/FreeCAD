// Part keys (A35): R opens a revolved boss, L a fillet, C a chamfer; the toolbar shows the letters.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc(R.sampleDoc()); R.rebuild(); R.renderSide(); });
  const out = {};
  for (const k of ['e', 'r', 'l', 'c']) { await p.keyboard.press(k); await p.waitForTimeout(200); out[k] = await p.evaluate(() => { const S = window.__rezets.S; return S.pm ? (S.pm.feature?.type || S.pm.kind) : S.pickSketch ? 'pick:' + (S.pickSketch.type || JSON.stringify(S.pickSketch).slice(0, 40)) : [...document.querySelectorAll('.toast')].map((t) => t.textContent).at(-1) || null; }); await p.keyboard.press('Escape'); await p.waitForTimeout(150); }
  out.kbd = await p.evaluate(() => [...document.querySelectorAll('#tools button, .tools button')].filter((x) => /Повернуть|Скругление|Фаска/.test(x.textContent)).map((x) => x.textContent.replace(/\s+/g, ' ').trim()));
  console.log(JSON.stringify(out)); console.log('expect e and r a sketch pick (pick:extrude, pick:revolve), l fillet, c chamfer; buttons end with R, L, C');
  console.log(logs.join('\n')); await b.close(); })();

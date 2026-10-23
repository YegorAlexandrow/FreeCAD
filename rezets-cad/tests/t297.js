// Fit leaves the view bar's band free, and a fitted model is fitted again when the window changes size (not one
// zoomed by hand).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const info = () => p.evaluate(() => { const R = window.__rezets; const S = R.S; S.body.computeBoundingBox(); const a = S.body.attributes.position; const v = S.body.boundingBox.min.clone(); let top = Infinity, bot = -Infinity;
    for (let i = 0; i < a.count; i += 3) { v.fromBufferAttribute(a, i); const s = R.toScreen(v); top = Math.min(top, s.y); bot = Math.max(bot, s.y); }
    return { top: Math.round(top), bot: Math.round(bot), zoom: +R.camInfo()[6].toFixed(3), H: document.getElementById('view').clientHeight }; });
  await p.mouse.move(700, 450); await p.keyboard.press('f'); await p.waitForTimeout(700); const fit = await info();
  await p.setViewportSize({ width: 1000, height: 600 }); await p.waitForTimeout(700); const small = await info();
  await p.mouse.move(600, 400); await p.mouse.wheel(0, -300); await p.waitForTimeout(300); const zoomed = (await info()).zoom; await p.setViewportSize({ width: 1400, height: 860 }); await p.waitForTimeout(700); const after = (await info()).zoom;
  console.log(JSON.stringify({ fit, small, zoomed, after })); console.log('expect fit.top >= 48 (the view bar band); small refitted, top >= 48; after == zoomed (zoomed by hand stays)');
  console.log(logs.join('\n')); await b.close(); })();

// H46: a circular pattern with «Равный шаг» off puts its copies the given angle apart; on, it spreads them over it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const ang = (M) => { const e = M.elements; return Math.round(Math.atan2(e[2], e[0]) * 180 / Math.PI); };
    const f = { type: 'cpattern', axis: { axis: 'y' }, n: 3, angle: 30 }; const eq = R.patternMatrices(f, []).map(ang); f.angleIsStep = true; const st = R.patternMatrices(f, []).map(ang); return { eq, st }; })));
  console.log('expect eq [-15,-30] or [15,30] (spread over 30°), st [±30, ±60]');
  console.log(logs.join('\n')); await b.close(); })();

// A13: a new feature starts from the values used last for its kind: a boss of depth 7 makes the next boss 7 deep.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800);
  const extrude = async (d) => { await p.evaluate(() => { const R = window.__rezets; R.S.selectedTree = 'feat:' + R.S.doc.features.find((f) => f.type === 'sketch').id; R.cmdFeature('extrude', 'add'); }); await p.waitForTimeout(300);
    const v = await p.evaluate(() => window.__rezets.S.pm?.feature?.depth); if (d) { await p.fill('#pmDepth', String(d)); await p.press('#pmDepth', 'Tab'); await p.waitForTimeout(300); } await p.evaluate(() => window.__rezets.okPM()); await p.waitForTimeout(400); return v; };
  const first = await extrude(7); const second = await extrude(null);
  console.log(JSON.stringify({ first, second })); console.log('expect first 10 (default), second 7');
  console.log(logs.join('\n')); await b.close(); })();

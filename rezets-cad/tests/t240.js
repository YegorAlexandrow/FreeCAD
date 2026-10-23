// H4: a wrong entry in a panel field goes back to the last good value, not to the one the panel opened with.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.S.selectedTree = 'feat:' + R.S.doc.features.find((f) => f.type === 'sketch').id; R.cmdFeature('extrude', 'add'); }); await p.waitForTimeout(400);
  await p.fill('#pmDepth', '25'); await p.press('#pmDepth', 'Tab'); await p.waitForTimeout(300); await p.fill('#pmDepth', '-3'); await p.press('#pmDepth', 'Tab'); await p.waitForTimeout(300);
  console.log(JSON.stringify({ field: await p.$eval('#pmDepth', (e) => e.value), depth: await p.evaluate(() => window.__rezets.S.pm.feature.depth) }));
  console.log('expect field 25, depth 25');
  console.log(logs.join('\n')); await b.close(); })();

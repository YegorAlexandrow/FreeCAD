// P0-29: Up/Down arrows step a panel field by 1 (Shift by 10), and the model follows.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.S.selectedTree = 'feat:' + R.S.doc.features.find((f) => f.type === 'sketch').id; R.cmdFeature('extrude', 'add'); }); await p.waitForTimeout(400);
  await p.focus('#pmDepth'); await p.keyboard.press('ArrowUp'); await p.waitForTimeout(150); await p.keyboard.press('Shift+ArrowUp'); await p.waitForTimeout(150); await p.keyboard.press('ArrowDown'); await p.waitForTimeout(300);
  console.log(JSON.stringify({ field: await p.$eval('#pmDepth', (e) => e.value), depth: await p.evaluate(() => window.__rezets.S.pm.feature.depth) })); console.log('expect 20 (10 + 1 + 10 - 1)');
  console.log(logs.join('\n')); await b.close(); })();

// H7: typing a name that is not a variable offers to create it with the field's value, and the field then uses it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.S.selectedTree = 'feat:' + R.S.doc.features.find((f) => f.type === 'sketch').id; R.cmdFeature('extrude', 'add'); }); await p.waitForTimeout(400);
  await p.fill('#pmDepth', 'h*2'); await p.press('#pmDepth', 'Tab'); await p.waitForTimeout(300);
  const btn = await p.evaluate(() => [...document.querySelectorAll('.toast button')].map((e) => e.textContent));
  await p.locator('.toast button', { hasText: 'Создать' }).click(); await p.waitForTimeout(300);
  console.log(JSON.stringify({ btn, vars: await p.evaluate(() => window.__rezets.S.doc.vars), f: await p.evaluate(() => { const f = window.__rezets.S.pm.feature; return [f.depth, f.exprs]; }) }));
  console.log('expect btn [Создать h = 10], vars [{h, 10}], f [20, {depth: h*2}]');
  console.log(logs.join('\n')); await b.close(); })();

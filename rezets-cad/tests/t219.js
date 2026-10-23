// A23: «Откатить сюда» on a feature puts the rollback bar above it (the feature itself is rolled back), as SolidWorks does.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800);
  await p.locator('#side .row', { hasText: 'Бобышка2' }).click({ button: 'right' }); await p.waitForTimeout(150); await p.locator('#menu button', { hasText: 'Откатить сюда' }).click(); await p.waitForTimeout(400);
  console.log(JSON.stringify(await p.evaluate(() => { const S = window.__rezets.S; return { rb: S.doc.rollback, at: S.doc.features.findIndex((f) => f.name === 'Бобышка2') }; })));
  console.log('expect rb = at');
  console.log(logs.join('\n')); await b.close(); })();

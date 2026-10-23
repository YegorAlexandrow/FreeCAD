// D3: with a face of Бобышка1 picked first, a linear pattern copies Бобышка1, not the last feature.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800); await p.click('[data-view="iso"]'); await p.waitForTimeout(800);
  const s = await p.evaluate(() => { const R = window.__rezets; const h = R.castRay([-28, 100, 18], [0, -1, 0])[0]; return R.toScreen(h.point); });
  const box = await (await p.$('#cv')).boundingBox(); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(400);
  const origin = await p.evaluate(() => { const R = window.__rezets; return R.featById(R.S.faceOrigin)?.name; });
  await p.evaluate(() => window.__rezets.cmdPattern('lpattern')); await p.waitForTimeout(400);
  console.log(JSON.stringify({ origin, feats: await p.evaluate(() => window.__rezets.S.pm.feature.feats.map((id) => window.__rezets.featById(id).name)) }));
  console.log('expect feats [origin]');
  console.log(logs.join('\n')); await b.close(); })();

// N36: Extrude with a sketch picked below the rollback bar says so instead of putting the feature above its sketch.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const n0 = S.doc.features.length; R.setRollback(0); S.selectedTree = 'feat:' + S.doc.features.find((f) => f.type === 'sketch').id; R.cmdFeature('extrude', 'add');
    return { pm: !!S.pm, added: S.doc.features.length - n0, toast: [...document.querySelectorAll('.toast')].map((e) => e.textContent).join(' | ') }; })));
  console.log('expect pm false, added 0, a toast about the rollback bar');
  console.log(logs.join('\n')); await b.close(); })();

// Keyboard on controls: Space toggles a checkbox in an operation panel, Enter on a segment button picks it (does not
// apply the panel), Enter on a toolbar button runs it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1500); const out = {};
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; S.selectedTree = 'feat:' + S.doc.features.find((f) => f.type === 'sketch').id; R.cmdFeature('extrude', 'add'); });
  await p.waitForTimeout(300);
  const cb = p.locator('#side label.chk', { hasText: 'Обратное направление' }).locator('input'); const before = await cb.isChecked(); await cb.focus(); await p.keyboard.press(' ');
  out.checkbox = (await p.locator('#side label.chk', { hasText: 'Обратное направление' }).locator('input').isChecked()) !== before;
  const segBtn = p.locator('#side .seg button', { hasText: 'Насквозь' }); await segBtn.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  out.seg = await p.evaluate(() => ({ pmOpen: !!window.__rezets.S.pm, end: window.__rezets.S.pm?.feature?.end }));
  await p.keyboard.press('Escape'); await p.waitForTimeout(200); await p.evaluate(() => window.__rezets.S.pm && document.querySelector('.pm-act .cancel')?.click());
  const mass = p.locator('#tools button', { hasText: 'Масса' }); await mass.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  out.massPM = await p.evaluate(() => window.__rezets.S.pm?.kind || document.querySelector('#side .pm-h')?.textContent || null);
  console.log(JSON.stringify(out));
  console.log('expect checkbox true (toggled); seg pmOpen true end through; massPM some mass panel');
  console.log(logs.join('\n')); await b.close(); })();

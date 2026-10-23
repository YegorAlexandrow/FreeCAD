// B0-20: Tab hides the component under the cursor, Shift+Tab shows them all again; «Изолировать» leaves one visible.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const base = R.S.project.docs.find((d) => d.name === 'Кронштейн'); R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(base.id); R.asmInsert(base.id); R.asmInsert(base.id); });
  await p.waitForTimeout(400); const hid = () => p.evaluate(() => window.__rezets.S.doc.comps.map((c) => !!c.hidden));
  await p.evaluate(() => { window.__rezets.S.asmHover = { comp: window.__rezets.S.doc.comps[1].id }; document.activeElement?.blur?.(); }); await p.keyboard.press('Tab'); const a = await hid();
  await p.keyboard.press('Shift+Tab'); const c = await hid();
  await p.locator('#side .row', { hasText: 'Кронштейн<3>' }).click({ button: 'right' }); await p.waitForTimeout(150); await p.locator('#menu button', { hasText: 'Изолировать' }).click(); await p.waitForTimeout(200); const iso = await hid();
  console.log(JSON.stringify({ a, c, iso })); console.log('expect a [f,t,f], c all false, iso [t,t,f]');
  console.log(logs.join('\n')); await b.close(); })();

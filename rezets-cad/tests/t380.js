// P0-33: Ctrl+click in the tree picks several features; the menu then switches them off at once, Delete removes them.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1200);
  const names = await p.evaluate(() => window.__rezets.S.doc.features.filter((f) => f.type !== 'sketch').slice(-2).map((f) => f.name));
  await p.locator('#side .row', { hasText: names[0] }).first().click(); await p.locator('#side .row', { hasText: names[1] }).first().click({ modifiers: ['Control'] });
  const sel = await p.evaluate(() => [...(window.__rezets.S.treeMulti || [])].length);
  await p.locator('#side .row', { hasText: names[1] }).first().click({ button: 'right' }); await p.locator('#menu button', { hasText: 'Погасить выбранные' }).click(); await p.waitForTimeout(300);
  const off = await p.evaluate((names) => window.__rezets.S.doc.features.filter((f) => names.includes(f.name)).map((f) => !!f.suppressed), names);
  await p.locator('#side .row', { hasText: names[0] }).first().click(); await p.locator('#side .row', { hasText: names[1] }).first().click({ modifiers: ['Control'] }); await p.keyboard.press('Delete'); await p.waitForTimeout(300);
  const left = await p.evaluate((names) => window.__rezets.S.doc.features.filter((f) => names.includes(f.name)).length, names);
  console.log(JSON.stringify({ sel, off, left })); console.log('expect sel 2, off [true,true], left 0'); console.log(logs.join('\n')); await b.close(); })();

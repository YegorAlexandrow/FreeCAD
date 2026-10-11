// Exploded view of an assembly.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.setInputFiles('#stepIn', __dirname + '/../testdata/servo.step');
  await p.waitForFunction(() => window.__rezets.S.mode === 'import', null, { timeout: 60000 }); await p.waitForTimeout(400);
  await p.evaluate(() => { const R = window.__rezets; const servo = R.activeEntry().id; const br = R.S.project.docs.find((d) => d.name === 'Кронштейн').id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(br); R.asmInsert(servo); R.asmInsert(servo); });
  await p.click('[data-view="iso"]'); await p.waitForTimeout(500);
  const disp = () => p.evaluate(() => { const R = window.__rezets; return R.S.doc.comps.map((c) => R.displayT(R.S.doc, c).elements.slice(12, 15).map((v) => +v.toFixed(2)).join(',') + (c.T.slice(12, 15).map((v) => +v.toFixed(2)).join(',') === R.displayT(R.S.doc, c).elements.slice(12, 15).map((v) => +v.toFixed(2)).join(',') ? '=' : '*')); });
  await p.click('button.tool:has-text("Разнести")'); await p.waitForTimeout(300);
  await p.locator('.pm .chip', { hasText: 'Авторазнос' }).click(); await p.waitForTimeout(400);
  L('auto', JSON.stringify(await disp()), 'steps', await p.evaluate(() => window.__rezets.S.doc.explode.steps.length));
  await p.keyboard.press('f'); await p.waitForTimeout(300); await p.screenshot({ path: 's44_auto.png' });
  // manual step: last component up by 50
  const box = await (await p.$('#cv')).boundingBox();
  const s = await p.evaluate(() => { const R = window.__rezets; const c = R.S.doc.comps[2]; const M = R.displayT(R.S.doc, c); const inf = R.docInfo(c.doc); inf.geo.computeBoundingBox(); return R.toScreen(inf.geo.boundingBox.getCenter(M.elements ? new (inf.geo.boundingBox.min.constructor)() : null).applyMatrix4(M)); });
  await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(300);
  L('picked', await p.evaluate(() => JSON.stringify(window.__rezets.S.pm.cur.comps)));
  await p.fill('#exDist', '50'); await p.press('#exDist', 'Tab'); await p.click('text=Добавить шаг'); await p.waitForTimeout(300);
  L('after step', JSON.stringify(await disp()));
  await p.locator('.pm label.chk', { hasText: 'Показать разнесённым' }).locator('input').uncheck(); await p.waitForTimeout(300);
  L('collapsed', JSON.stringify(await disp()));
  L(logs.join('\n')); await b.close();
})();

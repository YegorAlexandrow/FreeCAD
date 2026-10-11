// Linear / circular pattern and mirror, checked by volume.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  const vol = () => p.evaluate(() => { const R = window.__rezets; return +R.geoVolume(R.S.body).toFixed(3); });
  const hole = Math.PI * 25 * 12; const v0 = await vol(); L('sample', v0, await p.evaluate(() => window.__rezets.S.doc.features.map((f) => f.name + ':' + f.type).join(' ')));
  const sel = async (name) => { await p.locator('.row', { hasText: name }).first().click(); };
  // linear pattern of Вырез2 along +Z, step 20, 2 instances (adds 2 holes)
  await sel('Вырез2'); await p.click('button.tool:has-text("Массив")'); await p.waitForTimeout(300);
  await p.locator('.pm .chip', { hasText: /^Z$/ }).first().click(); await p.fill('#pmStep', '20'); await p.press('#pmStep', 'Tab'); await p.fill('#pmCount', '2'); await p.press('#pmCount', 'Enter'); await p.waitForTimeout(1500);
  let v = await vol(); L('linear', v, 'removed', (v0 - v).toFixed(3), 'expect', (2 * hole).toFixed(3), JSON.stringify(await p.evaluate(() => window.__rezets.S.errors)));
  await p.screenshot({ path: 's32_lin.png' });
  await p.keyboard.press('Control+z'); await p.waitForTimeout(800); L('undo', await vol());
  // circular pattern of Вырез2 about Y, 2 instances (180°)
  await sel('Вырез2'); await p.click('button.tool:has-text("Круговой")'); await p.waitForTimeout(300);
  await p.fill('#pmCount', '2'); await p.press('#pmCount', 'Enter'); await p.waitForTimeout(1500);
  v = await vol(); L('circular', v, 'removed', (v0 - v).toFixed(3), 'expect', (2 * hole).toFixed(3), JSON.stringify(await p.evaluate(() => window.__rezets.S.errors)));
  await p.keyboard.press('Control+z'); await p.waitForTimeout(800);
  // mirror Вырез2 about Спереди (z=0)
  await sel('Вырез2'); await p.click('button.tool:has-text("Зеркало")'); await p.waitForTimeout(300);
  await p.locator('.pm .chip', { hasText: 'Спереди' }).click(); await p.waitForTimeout(300); await p.keyboard.press('Enter'); await p.waitForTimeout(1500);
  v = await vol(); L('mirror feature', v, 'removed', (v0 - v).toFixed(3), 'expect', (2 * hole).toFixed(3), JSON.stringify(await p.evaluate(() => window.__rezets.S.errors)));
  await p.keyboard.press('Control+z'); await p.waitForTimeout(800);
  // direction by clicking a model edge (longest straight edge)
  await sel('Вырез2'); await p.click('button.tool:has-text("Массив")'); await p.waitForTimeout(300);
  const box = await (await p.$('#cv')).boundingBox();
  const sp = await p.evaluate(() => { const R = window.__rezets; const T = R.S.pm.topo; const l = T.lines.slice().sort((x, y) => y[0].distanceTo(y[1]) - x[0].distanceTo(x[1]))[0]; return { s: R.toScreen(l[0].clone().lerp(l[1], 0.3)), d: l[1].clone().sub(l[0]).normalize().toArray().map((v) => +v.toFixed(3)) }; });
  await p.mouse.move(box.x + sp.s.x, box.y + sp.s.y, { steps: 3 }); await p.waitForTimeout(100); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(800);
  L('edge dir', JSON.stringify(sp.d), await p.evaluate(() => { const f = window.__rezets.S.pm.feature; return JSON.stringify(f.dir.edge ? 'edge' : f.dir); }), await p.$eval('.pickbox', (e) => e.textContent));
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  // mirror the whole body about Сверху (y=0): touches along the bottom face
  await p.keyboard.press('Escape'); await p.click('button.tool:has-text("Зеркало")'); await p.waitForTimeout(300);
  await p.locator('.pm label.chk', { hasText: 'Всё тело' }).locator('input').check(); await p.locator('.pm .chip', { hasText: 'Сверху' }).click(); await p.waitForTimeout(300); await p.keyboard.press('Enter'); await p.waitForTimeout(2500);
  v = await vol(); L('mirror body', v, 'expect', (2 * v0).toFixed(3), JSON.stringify(await p.evaluate(() => window.__rezets.S.errors)));
  await p.keyboard.press('f'); await p.waitForTimeout(400); await p.screenshot({ path: 's32_mirror.png' });
  L(logs.join('\n')); await b.close();
})();

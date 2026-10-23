// A5: «Линия» on the Sketch tab outside a sketch asks for a plane, then opens the sketch with the Line tool on.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Новая деталь' }).click(); await p.waitForTimeout(400);
  await p.click('#tabSketch'); await p.waitForTimeout(200); const dis = await p.$eval('button.tool:has-text("Линия")', (e) => e.disabled);
  await p.click('button.tool:has-text("Линия")'); await p.waitForTimeout(300); const pm = await p.evaluate(() => window.__rezets.S.pm?.kind);
  await p.locator('#side button, #side .chip, #side .row', { hasText: 'Спереди' }).first().click(); await p.waitForTimeout(500);
  console.log(JSON.stringify({ dis, pm, editing: await p.evaluate(() => !!window.__rezets.S.editing), tool: await p.evaluate(() => window.__rezets.S.tool) }));
  console.log('expect dis false, pm pickPlane, editing true, tool line');
  console.log(logs.join('\n')); await b.close(); })();

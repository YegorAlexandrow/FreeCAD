// Drawing of an assembly with an imported STEP part; SVG export.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open({ viewport: { width: 1500, height: 1000 } });
  await p.setInputFiles('#stepIn', __dirname + '/../testdata/servo.step');
  await p.waitForFunction(() => window.__rezets.S.mode === 'import', null, { timeout: 60000 }); await p.waitForTimeout(400);
  await p.evaluate(() => { const R = window.__rezets; const servo = R.activeEntry().id; const br = R.S.project.docs.find((d) => d.name === 'Кронштейн').id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(br); R.asmInsert(servo); });
  const t0 = Date.now(); await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Новый чертёж' }).click(); await p.waitForTimeout(1500);
  console.log('asm drawing ms', Date.now() - t0, await p.evaluate(() => { const R = window.__rezets; const L = R.layoutDrawing(R.S.doc); return L.error || R.scaleText ? '' : JSON.stringify({ scale: L.scale, views: Object.keys(L.pos) }); }));
  await p.screenshot({ path: 's46_asm.png' });
  await p.click('button.tool:has-text("SVG")'); await p.waitForTimeout(300);
  const svg = await p.$eval('#modal textarea', (e) => e.value); console.log('svg', svg.slice(0, 120), svg.length, /<\/svg>$/.test(svg));
  console.log(logs.join('\n')); await b.close();
})();

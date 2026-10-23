// The project's documents are one dropdown: the header shows the open one; the list, grouped by kind, switches.
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/arm0_asm.json', 'utf8');
(async () => { const { b, p, logs } = await open({ dark: true });
  await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d14'); }, proj);
  await p.click('.doccur'); await p.waitForTimeout(200); await p.screenshot({ path: process.env.SHOT || '/tmp/doclist.png', clip: { x: 0, y: 0, width: 700, height: 360 } });
  const out = await p.evaluate(() => ({ header: document.querySelector('.doccur').textContent, groups: [...document.querySelectorAll('#menu .dl-h')].map((x) => x.textContent), rows: [...document.querySelectorAll('#menu .dl-row')].map((x) => x.textContent) }));
  await p.click('#menu .dl-row >> text=Сборка 2'); await p.waitForTimeout(300); out.after = await p.evaluate(() => [document.querySelector('.doccur').textContent, document.getElementById('menu').hidden]);
  console.log(JSON.stringify(out), '\nexpect header ARM0▾, groups Детали/Сборки/Импорт (STEP, STL), after [Сборка 2▾, true]');
  console.log(logs.join('\n')); await b.close(); })();

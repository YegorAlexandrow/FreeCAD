// Features are reordered by dragging in the tree; a feature that is built on another cannot go above it.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm2_user5_1uw.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  await p.evaluate((d) => window.__rezets.loadDoc(d), doc);
  const order = () => p.evaluate(() => window.__rezets.S.doc.features.filter((f) => f.type !== 'sketch').map((f) => f.name).join(','));
  const drag = async (from, to) => { const a = await p.$(`#side .row[data-fid="${from}"]`); await a.scrollIntoViewIfNeeded(); const ba = await a.boundingBox(); const c = await p.$(`#side .row[data-fid="${to}"]`); const bc = await c.boundingBox();
    await p.mouse.move(ba.x + 40, ba.y + ba.height / 2); await p.mouse.down(); for (let k = 1; k <= 8; k++) await p.mouse.move(ba.x + 40, ba.y + ba.height / 2 + (bc.y + 3 - ba.y - ba.height / 2) * k / 8); await p.mouse.up(); await p.waitForTimeout(300); };
  const o0 = await order(); const v0 = await p.evaluate(() => +window.__rezets.geoVolume(window.__rezets.S.body).toFixed(1));
  await drag('f29', 'f26'); const o1 = await order(); const v1 = await p.evaluate(() => +window.__rezets.geoVolume(window.__rezets.S.body).toFixed(1));
  await drag('f42', 'f4'); const o2 = await order(); const toast = await p.evaluate(() => [...document.querySelectorAll('.toast')].map((t) => t.textContent).join(' | '));
  console.log(JSON.stringify({ o0, o1, o2, same: v0 === v1, toast, errors: await p.evaluate(() => window.__rezets.S.errors) }, null, 1));
  console.log('expect o1 with Вырез6 before Отверстие1, same volume; o2 = o1 (Бобышка7 sits on a face of Бобышка4) with a toast saying so; no errors');
  console.log(logs.join('\n')); await b.close(); })();

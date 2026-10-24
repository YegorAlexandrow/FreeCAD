// Mouse moves and a drag in a sketch leave no GPU geometry behind, and line materials are not collected in a list.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.editFeature(R.S.doc.features.find((f) => f.type === 'sketch')); }); await p.waitForTimeout(800);
  const info = () => p.evaluate(() => window.__rezets.rinfo()); const a = await info();
  for (let i = 0; i < 150; i++) await p.mouse.move(500 + (i % 50) * 10, 400 + Math.floor(i / 50) * 20);
  await p.mouse.move(700, 450); await p.mouse.down(); for (let i = 0; i < 40; i++) await p.mouse.move(700 + i, 450 + i / 2); await p.mouse.up(); await p.waitForTimeout(400);
  const z = await info();
  console.log(JSON.stringify({ geoBefore: a.geometries, geoAfter: z.geometries, lineMats: z.lineMats })); console.log('expect geoAfter close to geoBefore (it was +450), lineMats 0');
  console.log(logs.join('\n')); await b.close(); })();

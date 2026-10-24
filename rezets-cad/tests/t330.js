// Leaving a sketch that has features on it turns the view back the way it was before editing (A18).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc(R.sampleDoc()); R.rebuild(); });
  await p.click('text=Изометрия'); await p.waitForTimeout(800);
  const dir = () => p.evaluate(() => { const c = window.__rezets.camInfo(); const d = [c[0] - c[3], c[1] - c[4], c[2] - c[5]]; const L = Math.hypot(...d); return d.map((v) => +(v / L).toFixed(2)); });
  const d0 = await dir();
  await p.evaluate(() => { const R = window.__rezets; R.editFeature(R.S.doc.features.find((f) => f.type === 'sketch')); }); await p.waitForTimeout(800); const d1 = await dir();
  await p.evaluate(() => window.__rezets.exitSketch()); await p.waitForTimeout(800); const d2 = await dir();
  console.log(JSON.stringify({ d0, d1, d2 })); console.log('expect d1 along the sketch normal, d2 = d0');
  console.log(logs.join('\n')); await b.close(); })();

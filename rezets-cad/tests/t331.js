// Ctrl+Z that goes back into a sketch turns the view to it (A20).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc(R.sampleDoc()); R.rebuild(); R.editFeature(R.S.doc.features.find((f) => f.type === 'sketch')); });
  await p.waitForTimeout(600); await p.evaluate(() => window.__rezets.exitSketch()); await p.click('text=Изометрия'); await p.waitForTimeout(800);
  const dir = () => p.evaluate(() => { const c = window.__rezets.camInfo(); const d = [c[0] - c[3], c[1] - c[4], c[2] - c[5]]; const L = Math.hypot(...d); return d.map((v) => +(v / L).toFixed(2)); });
  const d0 = await dir(); await p.evaluate(() => window.__rezets.undo()); await p.waitForTimeout(800);
  const r = await p.evaluate(() => ({ editing: window.__rezets.S.editing, n: window.__rezets.featById(window.__rezets.S.editing || 'x')?.plane?.n }));
  console.log(JSON.stringify({ d0, ...r, d1: await dir() })); console.log('expect editing set, d1 = the sketch plane normal');
  console.log(logs.join('\n')); await b.close(); })();

// Patterns and mirrors as a SolidWorks user clicks them: in a new linear pattern a click right on a straight edge
// sets the direction (it used to add the base plate to the copies); a hole is picked by its cylindrical face; a new
// mirror asks for its plane first (no error before that), then takes features.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1500); const out = {};
  const scr = (v) => p.evaluate((v) => { const R = window.__rezets; R.S.body.computeBoundingBox(); const s = R.toScreen(new (R.S.body.boundingBox.min.constructor)(...v)); const r = document.getElementById('cv').getBoundingClientRect(); return [r.left + s.x, r.top + s.y]; }, v);
  await p.evaluate(() => { const R = window.__rezets; R.S.body.computeBoundingBox(); });
  const bb = await p.evaluate(() => { const b = window.__rezets.S.body.boundingBox; return [b.min.toArray(), b.max.toArray()]; });
  // the top front edge of the base plate: along X at y = max of base? use the bottom front edge (y=min, z=max)
  await p.evaluate(() => window.__rezets.cmdPattern('lpattern')); await p.waitForTimeout(400);
  const before = await p.evaluate(() => ({ feats: window.__rezets.S.pm.feature.feats.slice(), dir: JSON.stringify(window.__rezets.S.pm.feature.dir) }));
  const T = await p.evaluate(() => window.__rezets.S.pm.topo.lines.map(([a, b]) => [a.toArray(), b.toArray()]));
  const edge = T.find(([a, c]) => Math.abs(a[1] - c[1]) < 1e-6 && Math.abs(a[2] - c[2]) < 1e-6 && Math.abs(a[0] - c[0]) > 50);
  const [x, y] = await scr(edge[0].map((v, i) => (v + edge[1][i]) / 2)); await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(400);
  out.lin = { before, after: await p.evaluate(() => ({ feats: window.__rezets.S.pm.feature.feats.slice(), dir: !!window.__rezets.S.pm.feature.dir.edge })) };
  await p.evaluate(() => document.querySelector('.pm-act .cancel')?.click()); await p.waitForTimeout(200);
  out.mirror = await p.evaluate(() => { const R = window.__rezets; const S = R.S; S.selectedTree = null; R.cmdPattern('mirror'); return { pickFor: S.pm.pickFor, err: S.errors[S.pm.feature.id] || null, label: [...document.querySelectorAll('#side .pickbox')].map((x) => x.textContent).join('|') }; });
  console.log(JSON.stringify(out));
  console.log('expect lin.after: feats unchanged from before, dir edge true; mirror pickFor plane, err null, label «не выбрана»');
  console.log(logs.join('\n')); await b.close(); })();

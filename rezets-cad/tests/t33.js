// Hole wizard on a face: points in a sketch, counterbore / countersink / blind with drill point.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  const box = await (await p.$('#cv')).boundingBox();
  const vol = () => p.evaluate(() => { const R = window.__rezets; return +R.geoVolume(R.S.body).toFixed(3); });
  const clickW = async (x, y, z) => { const s = await p.evaluate(([x, y, z]) => window.__rezets.toScreen(new (window.__rezets.S.body.boundingBox.min.constructor)(x, y, z)), [x, y, z]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 2 }); await p.waitForTimeout(80); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(150); };
  const v0 = await vol();
  await p.evaluate(() => window.__rezets.S.body.computeBoundingBox());
  await clickW(-40, 12, 20); await p.waitForTimeout(200);
  L('selected', await p.evaluate(() => window.__rezets.S.selectedTree));
  await p.click('button.tool:has-text("Отверстие")'); await p.waitForTimeout(600);
  L('sketch on face', await p.evaluate(() => { const R = window.__rezets; return R.S.editing ? JSON.stringify(R.featById(R.S.editing).plane) + ' tool ' + R.S.tool : 'no'; }));
  // place two points via the point tool at world (-40,12,20) and (40,12,20)
  for (const x of [-40, 40]) { const uv = await p.evaluate(([x]) => { const R = window.__rezets; const pl = R.featById(R.S.editing).plane; const w = [x - pl.o[0], 12 - pl.o[1], 20 - pl.o[2]]; return R.toScreen(R.toWorld(pl, w[0] * pl.x[0] + w[1] * pl.x[1] + w[2] * pl.x[2], w[0] * pl.y[0] + w[1] * pl.y[1] + w[2] * pl.y[2])); }, [x]); await p.mouse.move(box.x + uv.x, box.y + uv.y, { steps: 2 }); await p.waitForTimeout(80); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(150); }
  await p.click('#corner .ok'); await p.waitForTimeout(800);
  L('pm', await p.evaluate(() => { const f = window.__rezets.S.pm?.feature; return f && JSON.stringify({ kind: f.kind, std: f.std, dia: f.dia, dir: f.dir }); }));
  await p.locator('.seg button', { hasText: 'Цековка' }).click(); await p.waitForTimeout(1200);
  await p.screenshot({ path: 's33_pm.png' });
  await p.keyboard.press('Enter'); await p.waitForTimeout(800);
  let v = await vol(); const exactCb = 2 * Math.PI * (2.75 ** 2 * 12 + (5 ** 2 - 2.75 ** 2) * 5.4);
  L('cbore M5 x2', 'removed', (v0 - v).toFixed(3), 'exact', exactCb.toFixed(3), JSON.stringify(await p.evaluate(() => window.__rezets.S.errors)));
  // countersink and blind variants via the feature data
  const variant = (patch) => p.evaluate((patch) => { const R = window.__rezets; const S = R.S; const f = S.doc.features.find((x) => x.type === 'hole'); Object.assign(f, patch); R.rebuild(); return +R.geoVolume(S.body).toFixed(3); }, patch);
  v = await variant({ kind: 'csink', dia: 5.5, csD: 10.4, csA: 90 }); { const r = 2.75, R2 = 5.2, h0 = R2 - r; const exact = 2 * Math.PI * (r * r * 12 + h0 * (R2 * R2 + R2 * r + r * r) / 3 - r * r * h0); L('csink', (v0 - v).toFixed(3), 'exact', exact.toFixed(3)); }
  v = await variant({ kind: 'simple', dia: 5.5, end: 'blind', depth: 8, tip: true }); { const r = 2.75, hc = r / Math.tan(59 * Math.PI / 180); L('blind+tip', (v0 - v).toFixed(3), 'exact', (2 * Math.PI * r * r * (8 + hc / 3)).toFixed(3)); }
  v = await variant({ kind: 'tap', std: 'M6', dia: 5, end: 'through' }); L('tap M6 drill 5', (v0 - v).toFixed(3), 'exact', (2 * Math.PI * 6.25 * 12).toFixed(3));
  await p.click('[data-view="iso"]'); await p.waitForTimeout(600); await p.screenshot({ path: 's33_holes.png' });
  // pattern a hole feature
  L('measure circles', await p.evaluate(() => window.__rezets.bodyTopo().circles.map((c) => +(2 * c.r).toFixed(3)).sort((a, b) => a - b).join(' ')));
  L(logs.join('\n')); await b.close();
})();

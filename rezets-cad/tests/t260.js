// H18: «До след.» on a sketch whose extrusion points away from the part turns towards the part by itself.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const mk = (x0, y0, w, h) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
      const q = [P(x0, y0), P(x0 + w, y0), P(x0 + w, y0 + h), P(x0, y0 + h)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); return sk; };
    const pl = { label: 'П', o: [0, 0, 30], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: mk(-20, -20, 40, 40) }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: pl, sk: mk(-5, -5, 10, 10) }] });
    R.S.selectedTree = 'feat:f3'; R.cmdFeature('extrude', 'add'); });
  await p.waitForTimeout(500); const dir0 = await p.evaluate(() => window.__rezets.S.pm.feature.dir);
  await p.locator('#side .seg button', { hasText: 'До след.' }).click(); await p.waitForTimeout(500);
  console.log(JSON.stringify({ dir0, dir1: await p.evaluate(() => window.__rezets.S.pm.feature.dir), err: await p.evaluate(() => window.__rezets.S.errors[window.__rezets.S.pm.feature.id] || null) }));
  console.log('expect err null (the extrusion reaches the block from 30 down to 10)');
  console.log(logs.join('\n')); await b.close(); })();

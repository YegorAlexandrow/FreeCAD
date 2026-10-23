// P0-20: suppressing a block also suppresses the sketch on its face and the boss from it; showing it brings them back.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const mk = (x0, y0, w, h) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
      const q = [P(x0, y0), P(x0 + w, y0), P(x0 + w, y0 + h), P(x0, y0 + h)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); return sk; };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: mk(-20, -20, 40, 40) }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: { label: 'Грань', o: [0, 0, 10], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1], face: { by: 'f2', d: 10 } }, sk: mk(-5, -5, 10, 10) }, { id: 'f4', type: 'extrude', name: 'Бобышка2', sketch: 'f3', mode: 'add', end: 'blind', depth: 5, dir: 1, regions: null }] }); });
  await p.waitForTimeout(300);
  await p.locator('#side .row', { hasText: 'Бобышка1' }).click({ button: 'right' }); await p.waitForTimeout(150); await p.locator('#menu button', { hasText: 'Погасить' }).click(); await p.waitForTimeout(400);
  const off = await p.evaluate(() => window.__rezets.S.doc.features.filter((f) => f.suppressed).map((f) => f.name)); const toast = await p.evaluate(() => document.querySelector('.toast')?.textContent);
  await p.locator('#side .row', { hasText: 'Бобышка1' }).click({ button: 'right' }); await p.waitForTimeout(150); await p.locator('#menu button', { hasText: 'Высветить' }).click(); await p.waitForTimeout(400);
  const back = await p.evaluate(() => [window.__rezets.S.doc.features.filter((f) => f.suppressed).length, JSON.stringify(window.__rezets.S.errors)]);
  console.log(JSON.stringify({ off, toast, back })); console.log('expect off [Бобышка1, Эскиз2, Бобышка2], back [0, {}]');
  console.log(logs.join('\n')); await b.close(); })();

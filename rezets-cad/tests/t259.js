// H10: while a new boss is being set up, the faces it adds are tinted; closing the panel clears the tint.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const mk = (x0, y0, w, h) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
      const q = [P(x0, y0), P(x0 + w, y0), P(x0 + w, y0 + h), P(x0, y0 + h)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); return sk; };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: mk(-20, -20, 40, 40) }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: { label: 'Грань', o: [0, 0, 10], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1], face: { by: 'f2', d: 10 } }, sk: mk(-5, -5, 10, 10) }] });
    R.S.selectedTree = 'feat:f3'; R.cmdFeature('extrude', 'add'); });
  await p.waitForTimeout(600); const on = await p.evaluate(() => window.__rezets.originCount()); await p.keyboard.press('Escape'); await p.waitForTimeout(300); const off = await p.evaluate(() => window.__rezets.originCount());
  console.log(JSON.stringify({ on, off })); console.log('expect on 1, off 0');
  console.log(logs.join('\n')); await b.close(); })();

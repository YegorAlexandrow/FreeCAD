// S0-28: a picked line's length and angle, and a picked point's X and Y, can be typed in the panel.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(0, 0), c = P(30, 10); sk.ents.l = { id: 'l', t: 'line', p1: a, p2: c }; P(50, 50);
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); R.S.sel = new Set(['e:l']); R.renderSide(); });
  await p.waitForTimeout(200); const field = (lbl) => p.locator('#side label.field', { hasText: lbl }).locator('input');
  await field('Длина').fill('50'); await field('Длина').press('Enter'); await p.waitForTimeout(200); await field('Угол').fill('90'); await field('Угол').press('Enter'); await p.waitForTimeout(200);
  const line = await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; const e = sk.ents.l; const a = sk.pts[e.p1], c = sk.pts[e.p2]; return [+Math.hypot(c.x - a.x, c.y - a.y).toFixed(3), +(Math.atan2(c.y - a.y, c.x - a.x) * 180 / Math.PI).toFixed(2)]; });
  await p.evaluate(() => { const R = window.__rezets; const sk = R.featById('f1').sk; const id = Object.keys(sk.pts).find((k) => sk.pts[k].x === 50); R.S.sel = new Set(['p:' + id]); R.renderSide(); }); await p.waitForTimeout(200);
  await field('X').fill('12'); await field('X').press('Enter'); await p.waitForTimeout(200);
  const pt = await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; return Object.values(sk.pts).filter((q) => Math.abs(q.y - 50) < 1e-6 && q.id !== sk.ents.l.p2).map((q) => q.x); });
  console.log(JSON.stringify({ line, pt })); console.log('expect line [50, 90], pt [12]');
  console.log(logs.join('\n')); await b.close(); })();

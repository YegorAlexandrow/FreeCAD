// N3/N46: the mass panel keeps significant digits for a 0.1 mm cube and groups the thousands for a 5 m one.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const run = async (s) => { await p.evaluate((s) => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(s, 0), P(s, s), P(0, s)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
      R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: s, dir: 1, regions: null }] }); }, s);
    await p.locator('#tools button', { hasText: 'Масса' }).click(); await p.waitForTimeout(400);
    const t = await p.$$eval('#side .kv', (els) => els.slice(0, 3).map((e) => e.textContent).join(' | ')); await p.keyboard.press('Escape'); return t; };
  console.log(JSON.stringify({ tiny: await run(0.1), huge: await run(5000) }));
  console.log('expect tiny: mass in мкг or мг with digits, volume 0.001 мм³, area 0.06 мм²; huge: grouped digits');
  console.log(logs.join('\n')); await b.close(); })();

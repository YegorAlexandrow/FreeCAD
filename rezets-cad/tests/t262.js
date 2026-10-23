// H70: in a loft, a click on a sketch's line in the view takes it as a section, a second click drops it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const P = (sk, x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const sq = (w) => { const sk = R.newSketchData(); const q = [P(sk, -w, -w), P(sk, w, -w), P(sk, w, w), P(sk, -w, w)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); return sk; };
    const pl = (z) => ({ label: 'П', o: [0, 0, z], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 's1', type: 'sketch', name: 'С1', plane: pl(0), sk: sq(10) }, { id: 's2', type: 'sketch', name: 'С2', plane: pl(10), sk: sq(5) }, { id: 's3', type: 'sketch', name: 'С3', plane: pl(20), sk: sq(10) }] });
    R.cmdLoft('add'); });
  await p.click('[data-view="right"]'); await p.waitForTimeout(800);
  const s0 = await p.evaluate(() => window.__rezets.S.pm?.feature?.sketches);
  const pt = await p.evaluate(() => { const R = window.__rezets; return R.toScreen(R.toWorld({ o: [0, 0, 0], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] }, 10, 3)); }); const box = await (await p.$('#cv')).boundingBox();
  await p.mouse.click(box.x + pt.x, box.y + pt.y); await p.waitForTimeout(400); const s1 = await p.evaluate(() => window.__rezets.S.pm?.feature?.sketches);
  await p.mouse.click(box.x + pt.x, box.y + pt.y); await p.waitForTimeout(400); const s2 = await p.evaluate(() => window.__rezets.S.pm?.feature?.sketches);
  console.log(JSON.stringify({ s0, s1, s2 })); console.log('expect s1 adds s1 (С1), s2 = s0');
  console.log(logs.join('\n')); await b.close(); })();

// N29: the pattern count field refuses more than 500 copies (each one is a boolean on the whole part).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(0, 0), P(100, 0), P(100, 20), P(0, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    const s2 = R.newSketchData(); const c = String(s2.nid++); s2.pts[c] = { id: c, x: 5, y: 10 }; s2.ents.c = { id: 'c', t: 'circle', c, r: 3 };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: R.PLANES.front, sk: s2 }, { id: 'f4', type: 'extrude', name: 'Вырез1', sketch: 'f3', mode: 'cut', end: 'through', depth: 10, dir: 1, regions: null }, { id: 'f5', type: 'lpattern', name: 'Массив1', feats: ['f4'], dir: { axis: 'x' }, d: 10, n: 3 }] });
    R.editFeature(R.featById('f5')); });
  await p.waitForTimeout(400); await p.fill('#pmCount', '1000'); await p.press('#pmCount', 'Tab'); await p.waitForTimeout(400);
  console.log(JSON.stringify(await p.evaluate(() => ({ n: window.__rezets.featById('f5').n, field: document.getElementById('pmCount')?.value, toast: document.querySelector('.toast')?.textContent }))));
  console.log('expect n 3, field 3, toast about 500 copies');
  console.log(logs.join('\n')); await b.close(); })();

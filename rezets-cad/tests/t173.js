// A linear pattern of a hole whose last copies fall off the plate says how many copies miss the part.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(50, 0), P(50, 20), P(0, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    const sk3 = R.newSketchData(); const h = String(sk3.nid++); sk3.pts[h] = { id: h, x: 10, y: 10 }; sk3.ents.h = { id: 'h', t: 'circle', c: h, r: 2 };
    const top = { label: 'Грань', o: [0, 0, 5], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Плита', sketch: 'f1', mode: 'add', end: 'blind', depth: 5, dir: 1, regions: null },
      { id: 'f5', type: 'sketch', name: 'Эскиз3', plane: top, sk: sk3 }, { id: 'f6', type: 'extrude', name: 'Вырез', sketch: 'f5', mode: 'cut', end: 'through', depth: 5, dir: -1, regions: null },
      { id: 'f7', type: 'lpattern', name: 'Массив1', feats: ['f6'], n: 6, d: 12, dir: { axis: 'x' } }] });
    return { warn: S.warns.f7, err: S.errors.f7 || null }; })));
  console.log('expect warn «2 из 5 копий не задевают деталь» (copies at 58, 70), err null');
  console.log(logs.join('\n')); await b.close(); })();

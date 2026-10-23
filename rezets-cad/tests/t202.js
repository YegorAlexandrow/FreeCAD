// N28: a linear pattern of 100 through holes builds in a few seconds and removes exactly 100 holes' volume;
// copies that miss the part are still counted.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(0, 0), P(1000, 0), P(1000, 20), P(0, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    const s2 = R.newSketchData(); const c = String(s2.nid++); s2.pts[c] = { id: c, x: 5, y: 10 }; s2.ents.c = { id: 'c', t: 'circle', c, r: 3 };
    const base = [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: R.PLANES.front, sk: s2 }, { id: 'f4', type: 'extrude', name: 'Вырез1', sketch: 'f3', mode: 'cut', end: 'through', depth: 10, dir: 1, regions: null }];
    const run = (n) => { const t0 = performance.now(); R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [...base, { id: 'f5', type: 'lpattern', name: 'Массив1', feats: ['f4'], dir: { axis: 'x' }, d: 10, n }] }); return { ms: Math.round(performance.now() - t0), dv: +(200000 - R.geoVolume(S.body)).toFixed(0), warn: S.warns.f5 || null, err: JSON.stringify(S.errors) }; };
    return { n100: run(100), n105: run(105) }; })));
  console.log('expect n100 ms well under 15000, dv ≈ 28262 (100 × π9 × 10, faceted), no warning; n105 warns 5 of 105 copies miss');
  console.log(logs.join('\n')); await b.close(); })();

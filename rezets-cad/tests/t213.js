// N5: a sweep along a 90° arc of r 5000 mm builds in about a second, within 0.1 % of Pappus' volume.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const P = (sk, x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const psk = R.newSketchData(); const c = P(psk, 5000, 0), a = P(psk, 0, 0), bb = P(psk, 5000, 5000); psk.ents.a = { id: 'a', t: 'arc', c, p1: bb, p2: a, r: 5000 };
    const sk = R.newSketchData(); sk.ents.c = { id: 'c', t: 'circle', c: P(sk, 0, 0), r: 20 };
    const t0 = performance.now(); R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'pa', type: 'sketch', name: 'Путь', plane: R.PLANES.front, sk: psk }, { id: 'pr', type: 'sketch', name: 'Профиль', plane: R.PLANES.top, sk }, { id: 'sw', type: 'sweep', name: 'ПоТраектории1', sketch: 'pr', path: 'pa', mode: 'add', regions: null }] });
    const ms = Math.round(performance.now() - t0); const v = R.geoVolume(S.body); const exact = Math.PI * 400 * Math.PI / 2 * 5000;
    return { ms, ratio: +(v / exact).toFixed(4), tris: S.body.getAttribute('position').count / 3, err: JSON.stringify(S.errors) }; })));
  console.log('expect ms well under 21000, ratio 0.999..1, no errors');
  console.log(logs.join('\n')); await b.close(); })();

// N21/N42: a depth from a variable that comes out negative is an error on the feature (no inside-out body,
// no negative mass); a loop of variables names the loop.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(0, 0), P(40, 0), P(40, 20), P(0, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, vars: [{ name: 'h', expr: '30' }], features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null, exprs: { depth: 'h-20' } }] });
    const run = () => { R.applyVars(); S.cache.clear(); R.rebuild(); return { vol: S.body ? +R.geoVolume(S.body).toFixed(1) : null, err: S.errors.f2 || null }; };
    const ok = run(); S.doc.vars[0].expr = '10'; const neg = run(); S.doc.vars = [{ name: 'h', expr: 'w*2' }, { name: 'w', expr: 'h/2' }]; const loop = run(); S.doc.vars = [{ name: 'h', expr: '25' }]; const back = run();
    return { ok, neg, loop, back }; })));
  console.log('expect ok vol 8000; neg vol null with an error naming h-20 = -10; loop error about a loop; back vol 4000, no error');
  console.log(logs.join('\n')); await b.close(); })();

// N1: fillets on every edge of a 0.1 mm cube (r 0.01) find all 12 edges, as on a 1 mm cube (r 0.1).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    const run = (s) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(s, 0), P(s, s), P(0, s)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
      const base = [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: s, dir: 1, regions: null }];
      R.loadDoc({ name: 'T', nid: 10, rollback: null, features: base }); const edges = R.edgeTopology(S.body, S.cyls).lines.map(([a, c]) => ({ t: 'line', a: a.toArray(), b: c.toArray() }));
      R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [...base, { id: 'f3', type: 'fillet', name: 'Скругление1', r: s / 10, edges }] });
      return { edges: edges.length, err: S.errors.f3 || null, ratio: +(R.geoVolume(S.body) / s ** 3).toFixed(4) }; };
    return { small: run(0.1), unit: run(1) }; })));
  console.log('expect both 12 edges, no error, the same volume ratio');
  console.log(logs.join('\n')); await b.close(); })();

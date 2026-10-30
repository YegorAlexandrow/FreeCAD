// P0-44: moments of inertia of a box about its centre of mass, against the formula V·(b²+c²)/12.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; };
    const a = P(-50, -30), bb = P(50, -30), c = P(50, 30), d = P(-50, 30); for (const [u, v] of [[a, bb], [bb, c], [c, d], [d, a]]) { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: v }; }
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 15, dir: 1, regions: null }] });
    const mp = R.massProps(S.body); const J = R.inertiaOf(S.body, mp.com); const V = mp.vol;
    const want = [V * (15 ** 2 + 60 ** 2) / 12, V * (100 ** 2 + 60 ** 2) / 12, V * (100 ** 2 + 15 ** 2) / 12];
    return { diag: [J.I[0][0], J.I[1][1], J.I[2][2]].map((v, i) => +(v / want[i]).toFixed(6)), principal: J.principal.map((v) => +v.toFixed(0)), off: +Math.abs(J.I[0][1]).toFixed(3) }; })));
  console.log('expect diag ratios 1, principal sorted, off-diagonal 0');
  console.log(logs.join('\n')); await b.close(); })();

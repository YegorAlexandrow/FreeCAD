// Trimming a line that has a point held at its middle moved that point to the middle of what was left, and with it
// everything drawn from it (a post standing on the middle of a base line slid by 1.5 mm). It stays, on the line.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const R = window.__rezets; const sk = { pts: {}, ents: {}, cons: {}, nid: 1 };
    const P = (id, x, y) => { sk.pts[id] = { id, x, y }; }; P('a', 0, 0); P('b', 10, 0); P('m', 5, 0); P('t', 5, 3); P('c', 7, -2); P('d', 7, 2);
    sk.ents.A = { id: 'A', t: 'line', p1: 'a', p2: 'b' }; sk.ents.V = { id: 'V', t: 'line', p1: 'm', p2: 't' }; sk.ents.C = { id: 'C', t: 'line', p1: 'c', p2: 'd' };
    sk.cons.k1 = { id: 'k1', t: 'midpoint', refs: ['m', 'A'] }; sk.cons.k2 = { id: 'k2', t: 'vertical', refs: ['V'] }; sk.nid = 100;
    R.trimAt(sk, sk.ents.A, { u: 8.5, v: 0 }); R.solveSketch(sk);
    return { m: [sk.pts.m.x, sk.pts.m.y].map((v) => +v.toFixed(4)), t: [sk.pts.t.x, sk.pts.t.y].map((v) => +v.toFixed(4)), end: (() => { const q = sk.pts[sk.ents.A.p2]; return [+q.x.toFixed(4), +q.y.toFixed(4)]; })() }; });
  console.log(JSON.stringify(r)); console.log('expect m [5,0], t [5,3], end [7,0]'); console.log(logs.join('\n')); await b.close(); })();

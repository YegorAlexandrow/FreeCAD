// Sketch patterns: a circle in a linear 3x pattern and a rectangle in a circular 4x pattern about the origin; the
// copies follow the original, the count and step change afterwards, regions come out separate.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [] }); R.startSketch({ ...R.PLANES.front }); const f = S.doc.features.find((g) => g.id === S.editing); const sk = f.sk;
    sk.pts.c = { id: 'c', x: 0, y: 30 }; sk.ents.h = { id: 'h', t: 'circle', c: 'c', r: 2 };
    const P = (x, y) => { const k = 'q' + x + '_' + y; sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(20, -2), P(26, -2), P(26, 2), P(20, 2)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    const lin = R.makePattern(sk, ['h'], { kind: 'lin', n: 3, dx: 10, dy: 0 }); const circ = R.makePattern(sk, ['l0', 'l1', 'l2', 'l3'], { kind: 'circ', n: 4, ang: 360, c: 'O' });
    const circles = () => Object.values(sk.ents).filter((e) => e.t === 'circle').map((e) => [+sk.pts[e.c].x.toFixed(2), +sk.pts[e.c].y.toFixed(2), +e.r.toFixed(2)]);
    const out = { c1: circles(), regions1: R.sketchRegionsOf(f).faces.length };
    sk.ents.h.r = 3; sk.pts.c.x = 5; R.solveSketch(sk); out.follow = circles();
    R.updatePattern(sk, lin, { n: 4, dx: 8 }); out.c2 = circles(); out.regions2 = R.sketchRegionsOf(f).faces.length; out.dof = R.analyzeSketch(sk).dofMain; return out; })));
  console.log('expect c1 at x 0,10,20 y 30 r 2; regions1 7 (3 circles + 4 rectangles); follow: copies stay 10 apart with the original's radius; c2 four, 8 apart; regions2 8');
  console.log(logs.join('\n')); await b.close(); })();

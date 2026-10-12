// Dimension between two concentric circles: the radial gap drives the outer one; circles on
// different centres still get a centre distance.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const r = await p.evaluate(() => {
    const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; };
    const E = (o) => { const id = String(sk.nid++); sk.ents[id] = { id, ...o }; return id; };
    const c = P(0, 0), c2 = P(30, 0); const inner = E({ t: 'circle', c, r: 3.5 }), outer = E({ t: 'circle', c, r: 9 }), far = E({ t: 'circle', c: c2, r: 4 });
    const out = {};
    const add = (con) => { con.id = String(sk.nid++); return R.tryAddConstraint(sk, con).status; };
    out.d1 = add({ t: 'diam', refs: [inner], v: 7 });
    const g = R.makeDim(sk, ['e:' + outer, 'e:' + inner], { u: 5, v: 5 }); out.type = g.t; g.v = 3; out.add = add(g);
    out.rOuter = sk.ents[outer].r;
    const d = R.makeDim(sk, ['e:' + inner, 'e:' + far], { u: 15, v: 8 }); out.far = d && d.t;
    const g2 = Object.values(sk.cons).find((x) => x.t === 'rgap'); g2.v = 5; R.solveSketch(sk); out.rOuter2 = sk.ents[outer].r;
    return out;
  });
  console.log(JSON.stringify(r), 'expect rgap ok, outer r 6.5 then 8.5, far -> dist/dx');
  console.log(logs.join('\n')); await b.close();
})();

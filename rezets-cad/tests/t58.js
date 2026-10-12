// Under-defined sketch explained in words: which points move and how, which sizes are missing.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const r = await p.evaluate(() => {
    const R = window.__rezets; const out = {};
    const mk = (fill) => { const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; }; const E = (o) => { const id = String(sk.nid++); sk.ents[id] = { id, ...o }; return id; }; const C = (o) => { const id = String(sk.nid++); sk.cons[id] = { id, ...o }; return id; }; fill(P, E, C); R.solveSketch(sk); return R.explainFree(sk, R.analyzeSketch(sk)); };
    out.circleDiam = mk((P, E, C) => { const c = P(-124.31, -23.14); const e = E({ t: 'circle', c, r: 4.5 }); C({ t: 'diam', refs: [e], v: 9 }); });
    out.circleNone = mk((P, E) => { E({ t: 'circle', c: P(10, 10), r: 5 }); });
    out.lineH = mk((P, E, C) => { const a = P(0, 0), b = P(20, 0); const l = E({ t: 'line', p1: a, p2: b }); C({ t: 'horizontal', refs: [l] }); C({ t: 'coincident', refs: [a, 'O'] }); });
    out.full = mk((P, E, C) => { const c = P(0, 0); const e = E({ t: 'circle', c, r: 5 }); C({ t: 'coincident', refs: [c, 'O'] }); C({ t: 'diam', refs: [e], v: 10 }); });
    return out;
  });
  for (const [k, v] of Object.entries(r)) console.log(k, JSON.stringify(v));
  console.log(logs.join('\n')); await b.close();
})();

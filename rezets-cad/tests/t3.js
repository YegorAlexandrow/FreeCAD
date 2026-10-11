const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const r = await p.evaluate(() => {
    const R = window.__rezets; const out = {};
    const mk = () => { const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; }; const E = (o) => { o.id = String(sk.nid++); sk.ents[o.id] = o; return o.id; }; const C = (o) => { o.id = String(sk.nid++); return R.tryAddConstraint(sk, o); }; return { sk, P, E, C }; };
    // 1. FreeCAD case: arc end on line, then coincident with the line end
    { const { sk, P, E, C } = mk(); const a = P(-50, -10), bb = P(-5, -10); const L = E({ t: 'line', p1: a, p2: bb }); C({ t: 'horizontal', refs: [L] });
      const c = P(0, 0); const q = P(-9, -4.4); const q2 = P(5, 8.5); const A = E({ t: 'arc', c, p1: q, p2: q2, r: 10 });
      R.solveSketch(sk); const r1 = C({ t: 'online', refs: [q, L] }); const r2 = C({ t: 'coincident', refs: [bb, q] });
      const an = R.analyzeSketch(sk); const pb = sk.pts[bb], pq = sk.pts[q];
      out.freecadCase = { online: r1.status, coincident: r2.status, replaced: r2.replaced?.map(x => x.name), cons: Object.values(sk.cons).map(c => c.t), redundant: [...an.redundant], gap: Math.hypot(pb.x - pq.x, pb.y - pq.y) }; }
    // 2. Conflict: horizontal + vertical on same line
    { const { sk, P, E, C } = mk(); const L = E({ t: 'line', p1: P(0, 0), p2: P(10, 3) }); C({ t: 'horizontal', refs: [L] }); out.hv = C({ t: 'vertical', refs: [L] }).status; }
    // 3. Dimension edit precision + tangent
    { const { sk, P, E, C } = mk(); const a = P(0, 0), bb = P(30, 1); const L = E({ t: 'line', p1: a, p2: bb }); C({ t: 'fix', refs: [a] }); C({ t: 'horizontal', refs: [L] });
      const d = { t: 'dist', refs: [a, bb] }; C(d); d.v = 37.25; R.solveSketch(sk);
      const cc = P(10, 9); const Ci = E({ t: 'circle', c: cc, r: 5 }); C({ t: 'tangent', refs: [L, Ci] }); const dm = { t: 'diam', refs: [Ci] }; C(dm); dm.v = 16; R.solveSketch(sk);
      const len = Math.hypot(sk.pts[bb].x - sk.pts[a].x, sk.pts[bb].y - sk.pts[a].y); const dist = Math.abs(sk.pts[cc].y - sk.pts[a].y);
      out.precision = { len, r: sk.ents[Ci].r, centerToLine: dist }; }
    // 4. Regions: two overlapping circles -> 3 regions; lens area
    { const { sk, P, E } = mk(); E({ t: 'circle', c: P(0, 0), r: 10 }); E({ t: 'circle', c: P(10, 0), r: 10 });
      const reg = R.buildRegions(sk); const areas = reg.faces.map(f => f.area).sort((a, b) => a - b);
      const lensExact = 2 * 100 * Math.acos(0.5) - 0.5 * 10 * Math.sqrt(400 - 100);
      const lens = reg.faces.find(f => Math.abs(f.sample[0] - 5) < 3 && Math.abs(f.sample[1]) < 5);
      const loops = R.profileLoops(reg, new Set([lens.id])); const all = R.profileLoops(reg, new Set(reg.faces.map(f => f.id)));
      const area = (l) => { let a = 0; for (let i = 0; i < l.length; i++) { const p = l[i], q = l[(i + 1) % l.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; };
      out.regions = { n: reg.faces.length, crossing: reg.hasCrossing, lens: lens.area, lensExact, unionLoops: all.length, unionArea: area(all[0].pts), unionExact: 2 * Math.PI * 100 - lensExact, lensLoops: loops.length }; }
    // 5. Nested: rectangle with circle inside -> default even-odd: ring only
    { const { sk, P, E } = mk(); const a = P(-20, -20), bb = P(20, -20), c = P(20, 20), d = P(-20, 20); E({ t: 'line', p1: a, p2: bb }); E({ t: 'line', p1: bb, p2: c }); E({ t: 'line', p1: c, p2: d }); E({ t: 'line', p1: d, p2: a }); E({ t: 'circle', c: P(0, 0), r: 5 });
      const reg = R.buildRegions(sk); out.nested = reg.faces.map(f => ({ area: Math.round(f.area * 100) / 100, on: f.defaultOn, holes: f.holes.length })); }
    return out;
  });
  console.log(JSON.stringify(r, null, 1));
  console.log(logs.join('\n'));
  await b.close();
})();

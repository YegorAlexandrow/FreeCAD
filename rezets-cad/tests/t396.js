// S0-19: trimming a spline and an ellipse at the lines crossing them, and a line at a spline.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); const L = (...a) => console.log(...a);
  L(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [] }); R.startSketch({ ...R.PLANES.front }); const sk = S.doc.features.find((f) => f.id === S.editing).sk;
    const P = (id, x, y) => { sk.pts[id] = { id, x, y }; return id; };
    // a spline from x=0 to 60 waving about y=0, crossed by vertical lines at x=20 and x=40
    ['s0', 's1', 's2', 's3'].forEach((id, i) => P(id, i * 20, i % 2 ? 5 : -5)); sk.ents.sp = { id: 'sp', t: 'spline', pts: ['s0', 's1', 's2', 's3'], p1: 's0', p2: 's3', closed: false };
    P('a1', 25, -20); P('a2', 25, 20); sk.ents.la = { id: 'la', t: 'line', p1: 'a1', p2: 'a2' }; P('b1', 45, -20); P('b2', 45, 20); sk.ents.lb = { id: 'lb', t: 'line', p1: 'b1', p2: 'b2' };
    const out = {};
    R.trimAt(sk, sk.ents.sp, { u: 35, v: 0 });
    const spl = Object.values(sk.ents).filter((e) => e.t === 'spline'); out.splines = spl.length; out.ends = spl.map((e) => [e.p1, e.p2].map((id) => [+sk.pts[id].x.toFixed(1)]).join('-'));
    // the line la is cut where it crosses the remaining left spline piece
    R.trimAt(sk, sk.ents.la, { u: 25, v: 15 }); out.la = [sk.ents.la.p1, sk.ents.la.p2].map((id) => +sk.pts[id].y.toFixed(2));
    // an ellipse crossed by a line through its middle: a click on its top half leaves the bottom half as a spline
    P('c', 100, 0); P('ax', 120, 0); sk.ents.el = { id: 'el', t: 'ellipse', c: 'c', p1: 'ax', r: 10 }; P('h1', 70, 0); P('h2', 130, 0); sk.ents.lh = { id: 'lh', t: 'line', p1: 'h1', p2: 'h2' };
    R.trimAt(sk, sk.ents.el, { u: 100, v: 10 }); const rest = Object.values(sk.ents).filter((e) => e.t === 'spline' && e.pts.some((id) => sk.pts[id].x > 70));
    out.ellipse = { gone: !sk.ents.el, rest: rest.length, maxY: rest.length ? +Math.max(...rest[0].pts.map((id) => sk.pts[id].y)).toFixed(3) : null, minY: rest.length ? +Math.min(...rest[0].pts.map((id) => sk.pts[id].y)).toFixed(2) : null };
    R.commitSketch(); return out; })));
  L('expect 2 splines ending at x 25 and 45 (0-25, 45-60), la cut at the spline (one end ~y of spline at x=25), ellipse gone, a spline below y=0 down to -10');
  L(logs.join('\n')); await b.close(); })();

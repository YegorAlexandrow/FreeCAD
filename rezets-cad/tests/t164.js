// A sketch can use another sketch's curves: an earlier sketch's line and circle show up as references (snapping,
// conversion), a line taken from it follows when that sketch changes, and is reported hanging when its source goes.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const o = {};
    const sk1 = R.newSketchData(); const P = (sk, x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(sk1, 0, 0), b2 = P(sk1, 30, 0); sk1.ents.L = { id: 'L', t: 'line', p1: a, p2: b2 }; sk1.ents.C = { id: 'C', t: 'circle', c: P(sk1, 50, 20), r: 6 };
    const off = { label: 'Плоскость', o: [0, 0, 15], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: sk1 }, { id: 'f2', type: 'sketch', name: 'Эскиз2', plane: off, sk: R.newSketchData() }] });
    const f2 = R.featById('f2'); R.editFeature(f2); const refs = S.refs; o.refs = { lines: refs.lines.length, circles: refs.circles.length, verts: refs.verts.length };
    const li = refs.lines.findIndex((q) => Math.abs(q[2] - q[0]) > 1); const key = R.materialize(f2.sk, 'r:l:' + li); const ci = refs.circles.findIndex((c) => Math.abs(c.r - 6) < 1e-6); const ckey = R.materialize(f2.sk, 'r:c:' + ci);
    { const sk2 = f2.sk; const e1 = sk2.ents[key.slice(2)]; const q = String(sk2.nid++); sk2.pts[q] = { id: q, x: 10, y: 20 }; sk2.ents.my = { id: 'my', t: 'line', p1: e1.p2, p2: q }; }
    R.commitSketch(); R.exitSketch();
    const ext = Object.values(f2.sk.ents).filter((e) => e.ext); o.ext = ext.map((e) => e.t);
    o.same = R.featById('f1').sk === sk1; const s1 = R.featById('f1').sk; s1.pts[b2].x = 40; s1.ents.C.r = 8; R.rebuild();
    const ln = ext.find((e) => e.t === 'line'); o.follow = [f2.sk.pts[ln.p1].x, f2.sk.pts[ln.p2].x].sort((x, y) => x - y); o.circR = ext.find((e) => e.t === 'circle').r;
    delete s1.ents.L; delete s1.pts[b2]; R.rebuild(); o.dangling = S.dangling.get('f2') || null; return o; })));
  console.log('expect refs lines ≥1, circles ≥1; ext [line, circle]; follow [0,40]; circR 8; dangling lists the lost end');
  console.log(logs.join('\n')); await b.close(); })();

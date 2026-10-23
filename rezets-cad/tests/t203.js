// N13/N23/N24/N25: a shell, loft or sweep that would leave an open, flat or self-crossing body is an error on the
// feature instead of a broken body: shell of a filleted block with the top open, loft of two sketches on one plane,
// sweep with a profile wider than the bend of its path, sweep with the profile in the plane of the path.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; let nid = 1000;
    const P = (sk, x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const E = (sk, o) => { const k = String(sk.nid++); o.id = k; sk.ents[k] = o; return k; };
    const rect = (sk, w, h) => { const ids = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([x, y]) => P(sk, x, y)); ids.forEach((a, i) => E(sk, { t: 'line', p1: a, p2: ids[(i + 1) % 4] })); };
    const SK = (plane, sk, name) => ({ id: 'f' + nid++, type: 'sketch', name: name || 'Эскиз' + nid, plane: JSON.parse(JSON.stringify(R.PLANES[plane])), sk });
    const load = (features) => { R.loadDoc({ name: 'T', nid: 500, rollback: null, features }); return { err: Object.values(S.errors)[0] || null, bad: S.body ? R.badEdges(S.body) : null }; };
    const out = {};
    { const sk = R.newSketchData(); rect(sk, 40, 40); const s1 = SK('front', sk); const bx = { id: 'f2', type: 'extrude', name: 'Б', sketch: s1.id, mode: 'add', end: 'blind', depth: 20, dir: 1, regions: null }; load([s1, bx]);
      const T = R.edgeTopology(S.body, S.cyls); const edges = [...T.lines.map(([a, c]) => ({ t: 'line', a: a.toArray(), b: c.toArray() })), ...T.circles.map((c) => ({ t: 'circle', c: c.c.toArray(), n: c.n.toArray(), r: c.r }))];
      out.shell = load([s1, bx, { id: 'f82', type: 'fillet', name: 'Скругление1', r: 3, edges }, { id: 'f83', type: 'shell', name: 'Оболочка1', t: 1, faces: [{ n: [0, 0, 1], d: 20 }] }]); }
    { const a = R.newSketchData(); rect(a, 40, 40); const c = R.newSketchData(); E(c, { t: 'circle', c: P(c, 0, 0), r: 10 }); const s1 = SK('front', a), s2 = SK('front', c);
      out.loft = load([s1, s2, { id: 'f71', type: 'loft', name: 'ПоСечениям1', sketch: s1.id, sketches: [s1.id, s2.id], mode: 'add' }]); }
    { const psk = R.newSketchData(); const c = P(psk, 50, 0), a = P(psk, 0, 0), bb = P(psk, 50, 50); E(psk, { t: 'arc', c, p1: bb, p2: a, r: 50 }); const ps = SK('front', psk, 'Траектория');
      const sk = R.newSketchData(); E(sk, { t: 'circle', c: P(sk, 0, 0), r: 60 }); const s1 = SK('top', sk, 'Профиль'); out.sweepX = load([ps, s1, { id: 'f70', type: 'sweep', name: 'ПоТраектории1', sketch: s1.id, path: ps.id, mode: 'add', regions: null }]); }
    { const psk = R.newSketchData(); const a = P(psk, 0, 0), bb = P(psk, 50, 0); E(psk, { t: 'line', p1: a, p2: bb }); const ps = SK('top', psk, 'Путь');
      const sk = R.newSketchData(); E(sk, { t: 'circle', c: P(sk, 0, 0), r: 60 }); const s1 = SK('top', sk, 'Профиль'); out.sweepFlat = load([ps, s1, { id: 'f70', type: 'sweep', name: 'ПоТраектории1', sketch: s1.id, path: ps.id, mode: 'add', regions: null }]); }
    return out; })));
  console.log('expect an error on each of shell, loft, sweepX, sweepFlat');
  console.log(logs.join('\n')); await b.close(); })();

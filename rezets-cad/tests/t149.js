// Sketch references to a hole on the model: the hole's diameter changes with its centre in place — the reference
// circle takes the new size; the hole is deleted while another hole exists — the reference stays where it was and is
// reported hanging instead of jumping onto the other hole; a point with no recorded faces on a hole's centre follows
// that centre, not the nearest corner.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const o = {};
    const mk = (build) => { const sk = R.newSketchData(); const P = (x, y, extra) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y, ...extra }; return k; }; build(sk, P); return sk; };
    const box = mk((sk, P) => { const q = [P(-30, -20), P(30, -20), P(30, 20), P(-30, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); });
    const holes = mk((sk, P) => { sk.ents.h1 = { id: 'h1', t: 'circle', c: P(-10, 0), r: 3 }; sk.ents.h2 = { id: 'h2', t: 'circle', c: P(15, 5), r: 3 }; });
    const top = { label: 'Грань', o: [0, 0, 10], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] };
    const ref = mk((sk, P) => { const c = P(-10, 0, { fixed: true, free: true, mref: { w: [-10, 0, 10], circle: true, r: 3 } }); sk.ents.e1 = { id: 'e1', t: 'circle', c, r: 3, ext: true };
      const q = P(-10, 0, { fixed: true, free: true, mref: { w: [-10, 0, 10], ns: [] } }); const a = P(-20, 10); sk.ents.l1 = { id: 'l1', t: 'line', p1: q, p2: a }; });
    R.loadDoc({ name: 'T', nid: 20, rollback: null, features: [
      { id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: box }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: top, sk: holes }, { id: 'f4', type: 'extrude', name: 'Вырез1', sketch: 'f3', mode: 'cut', end: 'through', depth: 10, dir: -1, regions: null },
      { id: 'f5', type: 'sketch', name: 'Эскиз3', plane: top, sk: ref }] });
    const f5 = () => R.featById('f5').sk; const st = () => ({ e1: [+f5().pts[f5().ents.e1.c].x.toFixed(3), +f5().pts[f5().ents.e1.c].y.toFixed(3), +f5().ents.e1.r.toFixed(3)], q: [+f5().pts[f5().ents.l1.p1].x.toFixed(3), +f5().pts[f5().ents.l1.p1].y.toFixed(3)], dangling: S.dangling.get('f5') || null });
    o.start = st();
    R.featById('f3').sk.ents.h1.r = 4; R.rebuild(); o.bigger = st();
    delete R.featById('f3').sk.ents.h1; R.rebuild(); o.deleted = st();
    return o; })));
  console.log('expect start e1 [-10,0,3] q [-10,0]; bigger e1 r 4, q stays; deleted: e1 and q stay at -10,0 and are listed as dangling (not on 15,5)');
  console.log(logs.join('\n')); await b.close(); })();

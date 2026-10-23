// A circular pattern whose axis was taken from a boss's rim stays on that boss when a dimension moves it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(80, 0), P(80, 60), P(0, 60)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    const sk2 = R.newSketchData(); const c = String(sk2.nid++); sk2.pts[c] = { id: c, x: 40, y: 30 }; sk2.ents.b = { id: 'b', t: 'circle', c, r: 8 };
    const sk3 = R.newSketchData(); const h = String(sk3.nid++); sk3.pts[h] = { id: h, x: 60, y: 30 }; sk3.ents.h = { id: 'h', t: 'circle', c: h, r: 2 };
    const top = { label: 'Грань', o: [0, 0, 5], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Плита', sketch: 'f1', mode: 'add', end: 'blind', depth: 5, dir: 1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: top, sk: sk2 }, { id: 'f4', type: 'extrude', name: 'Бобышка', sketch: 'f3', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null },
      { id: 'f5', type: 'sketch', name: 'Эскиз3', plane: top, sk: sk3 }, { id: 'f6', type: 'extrude', name: 'Вырез', sketch: 'f5', mode: 'cut', end: 'through', depth: 5, dir: -1, regions: null }] });
    const T = R.edgeTopology(S.body, S.cyls); const rim = T.circles.find((x) => Math.abs(x.r - 8) < 1e-6 && x.c.z > 14);
    S.doc.features.push({ id: 'f7', type: 'cpattern', name: 'Круговой массив1', feats: ['f6'], n: 4, angle: 360, axis: { edge: { t: 'circle', c: rim.c.toArray(), n: rim.n.toArray(), r: rim.r, src: rim.src } } }); R.rebuild(); const v1 = +R.geoVolume(S.body).toFixed(1);
    sk2.pts[c].x = 30; sk3.pts[h].x = 50; R.rebuild(); const ax = R.featById('f7').axis.edge.c.map((v) => +v.toFixed(2)); return { src: rim.src, v1, v2: +R.geoVolume(S.body).toFixed(1), ax, err: JSON.stringify(S.errors) }; })));
  console.log('expect src set, ax x 30 (followed the boss), v2 = v1 (four holes still inside the plate), no errors');
  console.log(logs.join('\n')); await b.close(); })();

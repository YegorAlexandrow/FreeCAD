// Extrude with draft, up to a parallel face and up to an inclined face.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  const r = await p.evaluate(() => {
    const R = window.__rezets; const out = {};
    const poly = (pts) => { const sk = R.newSketchData(); const ids = pts.map(([x, y]) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; }); ids.forEach((u, i) => { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: ids[(i + 1) % ids.length] }; }); return sk; };
    const circ = (x, y, r) => { const sk = R.newSketchData(); const c = String(sk.nid++); sk.pts[c] = { id: c, x, y }; const e = String(sk.nid++); sk.ents[e] = { id: e, t: 'circle', c, r }; return sk; };
    // 1. draft
    let doc = { name: 'Уклон', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk: poly([[-20, -20], [20, -20], [20, 20], [-20, 20]]) }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 20, dir: 1, regions: null, draft: 5 }] };
    R.loadDoc(doc); out.draft = R.geoVolume(R.S.body); out.draftErr = R.S.errors;
    doc.features[1].draft = 5; doc.features[1].end = 'mid'; R.rebuild(); out.draftMid = R.geoVolume(R.S.body);
    // 2. up to a parallel face: box, then a cylinder from a plane at y=50 down to the box top (y=15)
    doc = { name: 'ДоГрани', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk: poly([[-50, -30], [50, -30], [50, 30], [-50, 30]]) }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 15, dir: 1, regions: null },
      { id: 'f3', type: 'plane', name: 'Плоскость1', base: { std: 'top' }, d: 50 }, { id: 'f4', type: 'sketch', name: 'Эскиз2', plane: R.PLANES.top, planeRef: 'f3', sk: circ(0, 0, 5) },
      { id: 'f5', type: 'extrude', name: 'Бобышка2', sketch: 'f4', mode: 'add', end: 'face', target: { label: 'Грань', o: [0, 15, 0], x: [1, 0, 0], y: [0, 0, -1], n: [0, 1, 0] }, depth: 10, dir: 1, regions: null }] };
    R.loadDoc(doc); out.par = R.geoVolume(R.S.body) - 90000; out.parErr = R.S.errors;
    doc.features[4].offset = 5; R.rebuild(); out.parOff = R.geoVolume(R.S.body) - 90000;
    // 3. up to an inclined face: wedge x/100 + y/50 <= 1, cylinder from y=100 down to it at x=20
    doc = { name: 'Наклон', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: poly([[0, 0], [100, 0], [0, 50]]) }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'mid', depth: 40, dir: 1, regions: null },
      { id: 'f3', type: 'plane', name: 'Плоскость1', base: { std: 'top' }, d: 100 }, { id: 'f4', type: 'sketch', name: 'Эскиз2', plane: R.PLANES.top, planeRef: 'f3', sk: circ(20, 0, 5) },
      { id: 'f5', type: 'extrude', name: 'Бобышка2', sketch: 'f4', mode: 'add', end: 'face', target: { label: 'Грань', o: [100, 0, 0], x: [0, 0, 1], y: [0, 1, 0], n: [1 / Math.sqrt(5), 2 / Math.sqrt(5), 0] }, depth: 10, dir: 1, regions: null }] };
    R.loadDoc(doc); out.inc = R.geoVolume(R.S.body) - 100000; out.incErr = R.S.errors;
    return out;
  });
  const t = 40 - 2 * 20 * Math.tan(5 * Math.PI / 180); const fr = (a, b2, h) => h / 3 * (a * a + b2 * b2 + a * b2);
  L('draft', r.draft.toFixed(3), 'exact', fr(40, t, 20).toFixed(3), JSON.stringify(r.draftErr));
  const t2 = 40 - 2 * 10 * Math.tan(5 * Math.PI / 180); L('draft mid', r.draftMid.toFixed(3), 'exact', (2 * fr(40, t2, 10)).toFixed(3));
  L('up to parallel face', r.par.toFixed(3), 'polygon-exact≈', (Math.PI * 25 * 35).toFixed(3), JSON.stringify(r.parErr));
  L('up to face, offset 5', r.parOff.toFixed(3), '≈', (Math.PI * 25 * 30).toFixed(3));
  L('up to inclined face', r.inc.toFixed(3), '≈', (Math.PI * 25 * 60).toFixed(3), JSON.stringify(r.incErr));
  await p.click('[data-view="iso"]'); await p.waitForTimeout(600); await p.screenshot({ path: 's39_incl.png' });
  L(logs.join('\n')); await b.close();
})();

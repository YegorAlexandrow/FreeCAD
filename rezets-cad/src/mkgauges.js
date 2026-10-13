// Builds the horizontal-expansion test pieces in Rezets itself and writes their STL files and a project.
// Run: PW=$(npm root -g)/playwright node src/mkgauges.js <out dir>   (after ./wrap.sh)
const open = require('../tests/harness.js'); const fs = require('fs'); const path = require('path');
const out = process.argv[2] || '.'; fs.mkdirSync(out, { recursive: true });
(async () => {
  const { b, p, logs } = await open();
  const r = await p.evaluate(() => {
    const R = window.__rezets; const D = [2, 3, 4, 5, 6, 8]; const X = (i) => 8 + 12 * i;
    const sketch = (id, name, plane, draw) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
      const rect = (x0, y0, x1, y1) => { const q = [P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)]; q.forEach((a, i) => { const k = String(sk.nid++); sk.ents[k] = { id: k, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); };
      const circle = (x, y, rr) => { const c = P(x, y); const k = String(sk.nid++); sk.ents[k] = { id: k, t: 'circle', c, r: rr }; };
      draw(rect, circle); return { id, type: 'sketch', name, plane, sk }; };
    const ext = (id, name, sketchId, depth, regions = null) => ({ id, type: 'extrude', name, sketch: sketchId, mode: 'add', end: 'blind', depth, dir: 1, regions });
    const front = R.PLANES.front; const up = (z) => ({ ...front, label: 'Спереди +' + z, o: [0, 0, z] });
    const parts = [
      { name: 'Калибр квадрат 20 окно 10', features: [sketch('f1', 'Эскиз1', front, (rect) => { rect(-10, -10, 10, 10); rect(-5, -5, 5, 5); }), ext('f2', 'Бобышка1', 'f1', 4)] },
      { name: 'Калибр отверстия 2-8', features: [sketch('f1', 'Эскиз1', front, (rect, circle) => { rect(0, 0, 76, 16); D.forEach((d, i) => circle(X(i), 8, d / 2)); }), ext('f2', 'Бобышка1', 'f1', 3)] },
      { name: 'Калибр штыри 2-8', features: [sketch('f1', 'Эскиз1', front, (rect) => rect(0, 0, 76, 16)), ext('f2', 'Бобышка1', 'f1', 2), sketch('f3', 'Эскиз2', up(2), (rect, circle) => D.forEach((d, i) => circle(X(i), 8, d / 2))), ext('f4', 'Бобышка2', 'f3', 8)] },
    ];
    const res = [];
    for (const pt of parts) {
      const doc = { name: pt.name, nid: 10, rollback: null, features: pt.features }; const ent = R.addDoc('part', pt.name, doc);
      R.switchDoc(ent.id); const body = R.S.body; const vol = body ? R.geoVolume(body) : 0;
      // Disconnected bodies would mean the extrude picked the wrong regions.
      res.push({ name: pt.name, vol, bodies: body ? R.splitBodies(body).length : 0, errors: R.S.errors, stl: body ? R.stlText(body, pt.name) : '' });
    }
    return { res, project: JSON.stringify(R.projectToJSON()) };
  });
  const PI = Math.PI; const D = [2, 3, 4, 5, 6, 8]; const area = (d) => PI * d * d / 4;
  const exact = [20 * 20 * 4 - 10 * 10 * 4, 76 * 16 * 3 - 3 * D.reduce((s, d) => s + area(d), 0), 76 * 16 * 2 + 8 * D.reduce((s, d) => s + area(d), 0)];
  r.res.forEach((x, i) => { fs.writeFileSync(path.join(out, x.name + '.stl'), x.stl); console.log(x.name, 'vol', x.vol.toFixed(2), 'exact', exact[i].toFixed(2), 'bodies', x.bodies, JSON.stringify(x.errors)); });
  // The page starts with a sample part; the project keeps only the gauges.
  const proj = JSON.parse(r.project); const names = new Set(r.res.map((x) => x.name)); proj.docs = proj.docs.filter((d) => names.has(d.name)); proj.active = proj.docs[0].id; proj.name = 'Калибры';
  fs.writeFileSync(path.join(out, 'Калибры.rezets.json'), JSON.stringify(proj));
  console.log(logs.join('\n')); await b.close();
})();

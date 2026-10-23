// After a fillet on a vertical edge of a box, a sketch on the top face still sees the whole outline: the four sides
// and the fillet's arc (as a circle of the fillet radius), not facets.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(40, 0), P(40, 20), P(0, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    const top = { label: 'Грань', o: [0, 0, 10], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Б1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null },
      { id: 'f3', type: 'fillet', name: 'Скругление1', r: 5, edges: [{ t: 'line', a: [40, 20, 0], b: [40, 20, 10] }] }, { id: 'f4', type: 'sketch', name: 'Эскиз2', plane: top, sk: R.newSketchData() }] });
    const refs = R.modelRefs(R.featById('f4')); return { err: JSON.stringify(S.errors), lines: refs.lines.length, circles: refs.circles.map((c) => [+c.x.toFixed(2), +c.y.toFixed(2), +c.r.toFixed(2)]), verts: refs.verts.length }; })));
  console.log('expect no errors; 6 lines (4 sides + Эскиз1 lines on the parallel plane); a circle [35,15,5]; 7 vertices');
  console.log(logs.join('\n')); await b.close(); })();

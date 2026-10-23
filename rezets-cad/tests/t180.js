// A sketch on a plane through the body sees the section: on the front plane through a revolved-like block with a
// hole across it, the cut's straight runs and the hole's circle are references.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(40, 0), P(40, 20), P(0, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); sk.ents.h = { id: 'h', t: 'circle', c: P(20, 10), r: 4 };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Б1', sketch: 'f1', mode: 'add', end: 'mid', depth: 20, dir: 1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: R.PLANES.front, sk: R.newSketchData() }] });
    const refs = R.modelRefs(R.featById('f3')); return { lines: refs.lines.map((l) => l.map((v) => +v.toFixed(1))), circles: refs.circles.map((c) => [+c.x.toFixed(1), +c.y.toFixed(1), +c.r.toFixed(1)]) }; })));
  console.log('expect the 4 sides of the 40×20 section and the circle [20,10,4]');
  console.log(logs.join('\n')); await b.close(); })();

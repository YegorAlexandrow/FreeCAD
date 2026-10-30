// P0-39: the section goes along a picked face (or reference plane), not only the three standard planes.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1200);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; };
    P('a', 0, 0); P('b', 40, 0); P('c', 40, 20); P('d', 0, 20); [['A', 'a', 'b'], ['B', 'b', 'c'], ['C', 'c', 'd'], ['D', 'd', 'a']].forEach(([id, p1, p2]) => { sk.ents[id] = { id, t: 'line', p1, p2 }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Б', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1 }] }); R.rebuild();
    S.pickedFace = { label: 'Грань', o: [40, 0, 0], x: [0, 1, 0], y: [0, 0, 1], n: [1, 0, 0] }; R.toggleSection(); return { on: !!S.section, custom: S.section?.custom?.label, area: +(S.section?.area || 0).toFixed(1) }; });
  console.log(JSON.stringify(r)); console.log('expect on true, custom Грань, area 200 (20 × 10 across the box at its side)'); console.log(logs.join('\n')); await b.close(); })();

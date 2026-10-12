// "Up to next" for cuts and bosses, on the user's ARM1: the hole stops at the first wall instead of
// going through the opposite plate.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm1_user.json', 'utf8'));
(async () => {
  const { b, p, logs } = await open();
  const r = await p.evaluate((doc) => { const R = window.__rezets; const out = {};
    R.loadDoc(doc); out.through = +R.geoVolume(R.S.body).toFixed(1);
    const d2 = JSON.parse(JSON.stringify(doc)); d2.features.find((f) => f.id === 'f12').end = 'next'; R.loadDoc(d2); out.next = +R.geoVolume(R.S.body).toFixed(1); out.err = JSON.stringify(R.S.errors);
    // boss up to next: a 10x10 square on the outer face of the bottom plate, extruded inward, stops at the top plate
    const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; }; const ids = [[-90, -5], [-80, -5], [-80, 5], [-90, 5]].map(([x, y]) => P(x, y)); ids.forEach((u, i) => { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: ids[(i + 1) % 4] }; });
    const d3 = JSON.parse(JSON.stringify(doc)); d3.features.push({ id: 'f20', type: 'sketch', name: 'Э', plane: { label: 'Грань', o: [0, 0, -16.5], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] }, sk }, { id: 'f21', type: 'extrude', name: 'Стойка', sketch: 'f20', mode: 'add', end: 'next', depth: 5, dir: 1, regions: null });
    R.loadDoc(d3); out.boss = +(R.geoVolume(R.S.body) - out.through).toFixed(1); out.err3 = JSON.stringify(R.S.errors);
    return out; }, doc);
  console.log(JSON.stringify(r), 'expect next - through > 39 (the opposite plate keeps its 2 mm column, 2*pi*2.5^2 = 39.3):', (r.next - r.through).toFixed(1), '; boss 10x10 across the 33 mm gap = 3300');
  console.log(logs.join('\n')); await b.close();
})();

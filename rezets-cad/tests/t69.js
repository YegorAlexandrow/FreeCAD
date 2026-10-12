// Extrude start: offset from the sketch plane, or from a parallel face; volumes exact.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const r = await p.evaluate(() => {
    const R = window.__rezets; const out = {};
    const sq = (s) => { const sk = R.newSketchData(); const ids = [[-s, -s], [s, -s], [s, s], [-s, s]].map(([x, y]) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; }); ids.forEach((u, i) => { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: ids[(i + 1) % 4] }; }); return sk; };
    const run = (extra) => { R.loadDoc({ name: 'T', nid: 50, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Э1', plane: R.PLANES.top, sk: sq(20) }, { id: 'f2', type: 'extrude', name: 'Плита', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Э2', plane: R.PLANES.top, sk: sq(5) }, { id: 'f4', type: 'extrude', name: 'Стойка', sketch: 'f3', mode: 'add', end: 'blind', depth: 15, dir: 1, regions: null, ...extra }] });
      R.S.body.computeBoundingBox(); return { v: +R.geoVolume(R.S.body).toFixed(3), ymax: +R.S.body.boundingBox.max.y.toFixed(3), e: JSON.stringify(R.S.errors) }; };
    out.plain = run({}); // inside the plate up to 15: plate 16000 + 100*5
    out.offset = run({ from: 'offset', fromOffset: 30 }); // floating block 30..45
    out.face = run({ from: 'face', fromTarget: { label: 'Грань', o: [0, 10, 0], x: [1, 0, 0], y: [0, 0, -1], n: [0, 1, 0] } }); // from plate top 10..25
    out.cutOffset = (() => { R.loadDoc({ name: 'T', nid: 50, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Э1', plane: R.PLANES.top, sk: sq(20) }, { id: 'f2', type: 'extrude', name: 'Плита', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null }, { id: 'f3', type: 'sketch', name: 'Э2', plane: R.PLANES.top, sk: sq(5) }, { id: 'f4', type: 'extrude', name: 'Карман', sketch: 'f3', mode: 'cut', end: 'blind', depth: 3, dir: 1, regions: null, from: 'offset', fromOffset: 7 }] }); return +R.geoVolume(R.S.body).toFixed(3); })(); // pocket 7..10 from below the top
    return out;
  });
  console.log(JSON.stringify(r), '\nexpect plain 16500 ymax 15, offset 17500 ymax 45, face 17500 ymax 25, cutOffset 16000-300=15700');
  // the property panel offers the start, and a face click sets it
  await p.evaluate(() => { const R = window.__rezets; R.S.doc.features.find((f) => f.id === 'f4').from = undefined; R.rebuild(); });
  await p.locator('#side .row', { hasText: 'Карман' }).dblclick(); await p.waitForTimeout(400);
  console.log('panel:', await p.$$eval('#side .seg button', (els) => els.map((e) => e.textContent).join(' | ')));
  await p.locator('#side .seg button', { hasText: 'Смещение' }).click(); await p.waitForTimeout(200); await p.fill('#pmFromOff', '-2'); await p.keyboard.press('Tab'); await p.waitForTimeout(400);
  console.log('offset -2 from the panel:', await p.evaluate(() => JSON.stringify({ from: window.__rezets.S.pm.feature.from, off: window.__rezets.S.pm.feature.fromOffset })));
  console.log(logs.join('\n')); await b.close();
})();

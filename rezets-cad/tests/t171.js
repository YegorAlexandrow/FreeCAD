// Coplanar faces that don't touch are separate faces: the tops of two bosses of the same height made by two
// operations pick one at a time and each is credited to its own operation.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const mk = (rects) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; rects.forEach(([x0, y0, x1, y1], j) => { const q = [P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)]; q.forEach((a, i) => { sk.ents[`l${j}_${i}`] = { id: `l${j}_${i}`, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); }); return sk; };
    const top = { label: 'Грань', o: [0, 0, 5], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: mk([[0, 0, 60, 30]]) }, { id: 'f2', type: 'extrude', name: 'Плита', sketch: 'f1', mode: 'add', end: 'blind', depth: 5, dir: 1, regions: null },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: top, sk: mk([[5, 5, 20, 25]]) }, { id: 'f4', type: 'extrude', name: 'БобышкаА', sketch: 'f3', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null },
      { id: 'f5', type: 'sketch', name: 'Эскиз3', plane: top, sk: mk([[40, 5, 55, 25]]) }, { id: 'f6', type: 'extrude', name: 'БобышкаБ', sketch: 'f5', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null }] }); });
  await p.click('[data-view="iso"]'); await p.keyboard.press('f'); await p.waitForTimeout(600);
  const out = await p.evaluate(() => { const R = window.__rezets; const c = document.getElementById('cv').getBoundingClientRect(); const at = (x, y, z) => { const s = R.toScreen(new (R.S.body.boundingBox?.min?.constructor || Object)(x, y, z)); return s; };
    const pick = (x, y) => { const s = R.toScreen(new (R.S.body.getAttribute('position').array.constructor === Float32Array ? window.__V3 || (window.__V3 = R.S.body.boundingBox ? R.S.body.boundingBox.min.constructor : null) : null)(x, y, 15)); const ev = { clientX: c.left + s.x, clientY: c.top + s.y }; const h = R.partPickAt(ev); return h?.face ? { tris: h.face.tris.length, by: R.faceCreator(h.face) } : null; };
    R.S.body.computeBoundingBox(); return { a: pick(12, 15), b: pick(47, 15) }; });
  console.log(JSON.stringify(out)); console.log('expect a by f4, b by f6, each with its own triangles (2 each)');
  console.log(logs.join('\n')); await b.close(); })();

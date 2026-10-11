// Sweep and loft against exact volumes.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  const r = await p.evaluate(() => {
    const R = window.__rezets; const out = {};
    const chain = (pts, closed = true, arcs = {}) => { const sk = R.newSketchData(); const ids = pts.map(([x, y]) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; }); const n = closed ? ids.length : ids.length - 1; for (let i = 0; i < n; i++) { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: ids[i], p2: ids[(i + 1) % ids.length] }; } return sk; };
    const sq = (s, cx = 0, cy = 0) => chain([[cx - s / 2, cy - s / 2], [cx + s / 2, cy - s / 2], [cx + s / 2, cy + s / 2], [cx - s / 2, cy + s / 2]]);
    const run = (feats) => { R.loadDoc({ name: 'T', nid: 50, rollback: null, features: feats }); return { v: R.geoVolume(R.S.body), e: R.S.errors }; };
    const prof = { id: 'f1', type: 'sketch', name: 'Профиль', plane: R.PLANES.front, sk: sq(10) };
    out.straight = run([prof, { id: 'f2', type: 'sketch', name: 'Путь', plane: R.PLANES.top, sk: chain([[0, 0], [0, -50]], false) }, { id: 'f3', type: 'sweep', name: 'S', sketch: 'f1', path: 'f2', mode: 'add', regions: null }]);
    out.corner = run([prof, { id: 'f2', type: 'sketch', name: 'Путь', plane: R.PLANES.top, sk: chain([[0, 0], [0, -50], [40, -50]], false) }, { id: 'f3', type: 'sweep', name: 'S', sketch: 'f1', path: 'f2', mode: 'add', regions: null }]);
    // quarter arc of radius 30 in the top plane, starting at the origin heading along +z
    const ska = R.newSketchData(); const P = (x, y) => { const id = String(ska.nid++); ska.pts[id] = { id, x, y }; return id; }; const c = P(30, 0), a0 = P(0, 0), a1 = P(30, -30); const ae = String(ska.nid++); ska.ents[ae] = { id: ae, t: 'arc', c, p1: a1, p2: a0, r: 30 };
    out.arc270 = run([prof, { id: 'f2', type: 'sketch', name: 'Путь', plane: R.PLANES.top, sk: ska }, { id: 'f3', type: 'sweep', name: 'S', sketch: 'f1', path: 'f2', mode: 'add', regions: null }]);
    { const sk2 = JSON.parse(JSON.stringify(ska)); const k = Object.keys(sk2.ents)[0]; const e = sk2.ents[k]; [e.p1, e.p2] = [e.p2, e.p1]; out.arc = run([prof, { id: 'f2', type: 'sketch', name: 'Путь', plane: R.PLANES.top, sk: sk2 }, { id: 'f3', type: 'sweep', name: 'S', sketch: 'f1', path: 'f2', mode: 'add', regions: null }]); }
    // loft: 20x20 at y=0 to 10x10 at y=30
    out.loft = run([{ id: 'f1', type: 'sketch', name: 'Низ', plane: R.PLANES.top, sk: sq(20) }, { id: 'f2', type: 'plane', name: 'Пл', base: { std: 'top' }, d: 30 }, { id: 'f3', type: 'sketch', name: 'Верх', plane: R.PLANES.top, planeRef: 'f2', sk: sq(10) }, { id: 'f4', type: 'loft', name: 'L', sketch: 'f1', sketches: ['f1', 'f3'], mode: 'add' }]);
    // loft square -> circle
    const skc = R.newSketchData(); const cc = String(skc.nid++); skc.pts[cc] = { id: cc, x: 0, y: 0 }; const ce = String(skc.nid++); skc.ents[ce] = { id: ce, t: 'circle', c: cc, r: 8 };
    out.loftSqCirc = run([{ id: 'f1', type: 'sketch', name: 'Низ', plane: R.PLANES.top, sk: sq(20) }, { id: 'f2', type: 'plane', name: 'Пл', base: { std: 'top' }, d: 30 }, { id: 'f3', type: 'sketch', name: 'Верх', plane: R.PLANES.top, planeRef: 'f2', sk: skc }, { id: 'f4', type: 'loft', name: 'L', sketch: 'f1', sketches: ['f1', 'f3'], mode: 'add' }]);
    return out;
  });
  L('straight', r.straight.v.toFixed(3), 'exact 5000', JSON.stringify(r.straight.e));
  L('corner', r.corner.v.toFixed(3), 'exact 9000', JSON.stringify(r.corner.e));
  L('arc 270 from far end', r.arc270.v.toFixed(3), 'Pappus', (100 * 1.5 * Math.PI * 30).toFixed(3), JSON.stringify(r.arc270.e));
  L('arc', r.arc.v.toFixed(3), 'Pappus', (100 * Math.PI / 2 * 30).toFixed(3), JSON.stringify(r.arc.e));
  L('loft', r.loft.v.toFixed(3), 'exact 7000', JSON.stringify(r.loft.e));
  L('loft sq->circle', r.loftSqCirc.v.toFixed(3), JSON.stringify(r.loftSqCirc.e));
  await p.click('[data-view="iso"]'); await p.waitForTimeout(600); await p.screenshot({ path: 's40_loft.png' });
  // UI: two sketches, then the toolbar command
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const ids = [[-5, -5], [5, -5], [5, 5], [-5, 5]].map(([x, y]) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; }); ids.forEach((u, i) => { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: ids[(i + 1) % 4] }; });
    const pk = R.newSketchData(); const a = String(pk.nid++), c = String(pk.nid++); pk.pts[a] = { id: a, x: 0, y: 0 }; pk.pts[c] = { id: c, x: 0, y: -60 }; const e = String(pk.nid++); pk.ents[e] = { id: e, t: 'line', p1: a, p2: c };
    R.loadDoc({ name: 'UI', nid: 50, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Профиль', plane: R.PLANES.front, sk }, { id: 'f2', type: 'sketch', name: 'Путь', plane: R.PLANES.top, sk: pk }] }); });
  await p.click('button.tool:has-text("Траектория")'); await p.waitForTimeout(800);
  L('pm', await p.$eval('#pmProf', (e) => e.selectedOptions[0].textContent), await p.$eval('#pmPath', (e) => e.selectedOptions[0].textContent));
  await p.keyboard.press('Enter'); await p.waitForTimeout(800);
  L('ui sweep', await p.evaluate(() => { const R = window.__rezets; return [R.S.doc.features.map((f) => f.name).join(','), R.geoVolume(R.S.body).toFixed(3)]; }), 'expect 6000');
  L(logs.join('\n')); await b.close();
})();

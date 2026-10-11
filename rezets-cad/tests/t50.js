// Slot boss: straight edges between the end arcs are drawn; a cut from the boss's own sketch (coplanar walls)
// gives a clean body; point + circle offers concentric.
const open = require('./harness.js'); const fs = require('fs');
const userDoc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/slot_web.json', 'utf8'));
(async () => {
  const { b, p, logs } = await open(process.argv[2] === 'dark' ? { dark: true } : {});
  const L = (...a) => console.log(...a);
  const r = await p.evaluate((userDoc) => {
    const R = window.__rezets; const out = {};
    const slot = () => { const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; }; R.makeSlot(sk, P(-30, 0), P(30, 0), 12); return sk; };
    const rect = (x0, y0, x1, y1) => { const sk = R.newSketchData(); const ids = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; }); ids.forEach((u, i) => { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: ids[(i + 1) % 4] }; }); return sk; };
    const topo = () => { const T = R.edgeTopology(R.S.body, R.S.cyls); const cy = R.S.cyls; const onCyl = (x, y, z) => cy.some((c) => Math.abs(Math.hypot(x - c.p.x, z - c.p.z) - c.r) < 5e-3);
      let web = 0; const d = T.display; for (let i = 0; i < d.length; i += 6) if (onCyl(d[i], d[i + 1], d[i + 2]) && onCyl(d[i + 3], d[i + 4], d[i + 5]) && Math.abs(d[i + 1] - d[i + 4]) > 1e-3) web++;
      return { v: +R.geoVolume(R.S.body).toFixed(2), lines: T.lines.length, circles: T.circles.length, web, e: JSON.stringify(R.S.errors) }; };
    const f1 = { id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk: slot() }, f2 = { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 33, dir: 1, regions: null };
    R.loadDoc({ name: 'Деталь1', nid: 50, rollback: null, features: [f1, f2] }); out.boss = topo();
    const top = { ...R.PLANES.top, o: [0, 33, 0] };
    R.loadDoc({ name: 'Деталь1', nid: 50, rollback: null, features: [f1, f2, { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: top, sk: rect(-40, -5, 40, 5) }, { id: 'f4', type: 'extrude', name: 'Вырез1', sketch: 'f3', mode: 'cut', end: 'blind', depth: 29, dir: -1, regions: null }] }); out.cut = topo();
    R.loadDoc(userDoc); out.user = { v: +R.geoVolume(R.S.body).toFixed(1), e: JSON.stringify(R.S.errors) };
    R.loadDoc({ name: 'Деталь1', nid: 50, rollback: null, features: [f1, f2, { id: 'f3', type: 'extrude', name: 'Вырез1', sketch: 'f1', mode: 'cut', end: 'mid', depth: 29, dir: 1, regions: null }] }); out.ownCut = +R.geoVolume(R.S.body).toFixed(1);
    { const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; }; const c = P(10, 5), q = P(-20, 30); const e = String(sk.nid++); sk.ents[e] = { id: e, t: 'circle', c, r: 8 };
      R.S.sel = new Set(['p:' + q, 'e:' + e]); const opt = R.relationOptions(sk).find((o) => o[0] === 'concentric'); out.opts = R.relationOptions(sk).map((o) => o[1]).join(',');
      for (const con of opt[2]()) { con.id = String(sk.nid++); out.add = R.tryAddConstraint(sk, con).status; } R.S.sel = new Set(); const a = sk.pts[q], b = sk.pts[c]; out.conc = [a.x, a.y, b.x, b.y].map((x) => +x.toFixed(4)).join(','); }
    return out;
  }, userDoc);
  L('boss', JSON.stringify(r.boss), 'exact vol', (33 * (60 * 24 + Math.PI * 144)).toFixed(2), 'expect lines 4 web 0');
  L('cut ', JSON.stringify(r.cut), 'expect web 0');
  L('user part', JSON.stringify(r.user), 'expect ~19023 = 101876 - 2856.97*29');
  L('cut from own sketch', r.ownCut, 'exact', (18.5 * (60 * 24 + Math.PI * 144)).toFixed(1));
  L('point+circle', r.opts, '|', r.add, r.conc, 'expect point at centre');
  await p.click('[data-view="iso"]'); await p.waitForTimeout(600); await p.screenshot({ path: 's50_slot.png' });
  L(logs.join('\n')); await b.close();
})();

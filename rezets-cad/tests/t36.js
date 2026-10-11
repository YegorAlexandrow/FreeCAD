// Mates on vertices and edges, picked with the mouse.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.evaluate(() => {
    const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; };
    const a = P(-50, -30), bb = P(50, -30), c = P(50, 30), d = P(-50, 30); for (const [u, v] of [[a, bb], [bb, c], [c, d], [d, a]]) { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: v }; }
    const doc = { name: 'Коробка', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 15, dir: 1, regions: null }] };
    const ent = R.addDoc('part', 'Коробка', doc); R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(ent.id); R.asmInsert(ent.id);
    const c2 = R.S.doc.comps[1]; c2.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 150, 7, -20, 1]; R.asmRefresh(true);
  });
  await p.click('[data-view="iso"]'); await p.waitForTimeout(700);
  const box = await (await p.$('#cv')).boundingBox();
  const at = async (ci, local) => { const s = await p.evaluate(([ci, local]) => { const R = window.__rezets; const c = R.S.doc.comps[ci]; const pose = R.poseOf(c); const v = pose.t.clone().set(...local).applyQuaternion(pose.q).add(pose.t); return R.toScreen(v); }, [ci, local]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); await p.waitForTimeout(120); const hv = await p.evaluate(() => { const h = window.__rezets.S.pm?.hover; return h ? h.kind + (h.edge ? ':' + h.edge.t : '') : null; }); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(400); return hv; };
  const an = () => p.evaluate(() => { const S = window.__rezets.S; return { dof: S.asmAnalysis?.dof, mates: S.doc.mates.map((m) => m.type + ':' + m.a.kind + '/' + m.b.kind), t: S.doc.comps[1].T.slice(12, 15).map((v) => +v.toFixed(4)) }; });
  await p.keyboard.press('m'); await p.waitForTimeout(200);
  L('hover1', await at(0, [50, 15, 30]), 'hover2', await at(1, [-50, 15, 30]));
  L('pm', await p.evaluate(() => { const pm = window.__rezets.S.pm; return JSON.stringify({ picks: pm.picks.map((x) => x.kind), type: pm.type, res: pm.result }); }));
  await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  L('vertex-vertex', JSON.stringify(await an()), 'corner of 2 in world:', await p.evaluate(() => { const R = window.__rezets; const c = R.S.doc.comps[1]; const pose = R.poseOf(c); return pose.t.clone().set(-50, 15, 30).applyQuaternion(pose.q).add(pose.t).toArray().map((v) => +v.toFixed(6)).join(','); }), 'expect 50,15,30');
  // edge-edge: comp1 top front edge (y=15,z=30) collinear with comp2 top front edge; already collinear -> redundant except parallel...
  // instead: vertical edge of comp2 at local (-50,y,-30) onto comp1 plane x=50 is implied; test point-plane distance: comp2 vertex (50,15,-30) to comp1 top face
  await p.keyboard.press('Escape'); await p.keyboard.press('Control+z'); await p.waitForTimeout(500);
  L('after undo', JSON.stringify(await an()));
  await p.keyboard.press('m'); await p.waitForTimeout(200);
  L('edge hover', await at(0, [0, 15, 30]), await at(1, [0, 15, 30]));
  L('edge pm', await p.evaluate(() => { const pm = window.__rezets.S.pm; return JSON.stringify({ picks: pm.picks.map((x) => x.kind + (x.edge ? ':' + x.edge.t : '')), type: pm.type, res: pm.result }); }));
  await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  L('edge-edge coincident', JSON.stringify(await an()), 'expect t y=0,z=0 (x free)');
  await p.screenshot({ path: 's36_mates.png' });
  L(logs.join('\n')); await b.close();
})();

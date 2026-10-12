// Dragging a part left only a turn about its axis turns it; the mates stay satisfied.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const r0 = await p.evaluate(() => {
    const R = window.__rezets; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id);
    const asm = R.S.doc; const [c1, c2] = asm.comps; c2.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 30, 50, 10, 1];
    const inf = R.docInfo(c1.doc); const bore = inf.ents.findIndex((e) => e.kind === 'axis' && Math.abs(e.r - 12) < 1e-6); const top = inf.ents.findIndex((e) => e.kind === 'plane' && e.n.y > 0.99 && Math.abs(e.p.y - 12) < 1e-6); const bot = inf.ents.findIndex((e) => e.kind === 'plane' && e.n.y < -0.99);
    const ref = (c, i) => { const e = inf.ents[i]; return { comp: c.id, kind: e.kind, p: e.p.toArray(), d: (e.n || e.d).toArray(), r: e.r, e: i }; };
    const add = (m) => R.tryAddMate(asm, { id: 'm' + asm.nid++, name: 'M' + asm.nid, flip: false, ...m }).status;
    const s1 = add({ type: 'concentric', a: ref(c1, bore), b: ref(c2, bore) });
    const s2 = add({ type: 'distance', a: ref(c1, top), b: ref(c2, bot), v: 30, side: 1 });
    R.asmRefresh(true); return { s1, s2, dof: R.S.asmAnalysis.dof, T: c2.T.map((v) => +v.toFixed(3)) };
  });
  console.log('mates', JSON.stringify(r0));
  await p.click('[data-view="top"]'); await p.waitForTimeout(400); await p.keyboard.press('f'); await p.waitForTimeout(400);
  const box = await (await p.$('#cv')).boundingBox();
  // grab comp 2 at a plate corner (local x 50, z 30 on its top face) and drag sideways
  const s = await p.evaluate(() => { const R = window.__rezets; const c = R.S.doc.comps[1]; const pose = R.poseOf(c); return R.toScreen(pose.t.clone().set(45, 12, 25).applyQuaternion(pose.q).add(pose.t)); });
  await p.mouse.move(box.x + s.x, box.y + s.y); await p.mouse.down(); await p.mouse.move(box.x + s.x - 60, box.y + s.y + 140, { steps: 12 }); await p.mouse.up(); await p.waitForTimeout(300);
  console.log('after drag', await p.evaluate(() => { const R = window.__rezets; const asm = R.S.doc; const c = asm.comps[1]; const pose = R.poseOf(c); const ang = 2 * Math.acos(Math.min(1, Math.abs(pose.q.w))) * 180 / Math.PI;
    const res = asm.mates.map((m) => { const ca = asm.comps.find((x) => x.id === m.a.comp), cb = asm.comps.find((x) => x.id === m.b.comp); return Math.max(...R.mateResiduals(m, R.worldEnt(m.a, R.poseOf(ca)), R.worldEnt(m.b, R.poseOf(cb))).map(Math.abs)); });
    return JSON.stringify({ turned: +ang.toFixed(1), t: pose.t.toArray().map((v) => +v.toFixed(3)), maxResidual: Math.max(...res).toExponential(1) }); }), 'expect turned > 10 deg about the bore axis, t stays (0, 30+12.., 0), residual ~0');
  console.log(logs.join('\n')); await b.close();
})();

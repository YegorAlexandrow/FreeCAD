// Mechanical mates. Slot: a pin's axis rides the slot's middle line between its ends (pushed past an end, it comes
// back). Cam: a roller's axis stays parallel to the cam and its radius away from the cam's outline. Path: a vertex
// runs along a circular edge.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    const part = (name, build, depth) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; build(sk, P);
      return R.addDoc('part', name, { name, nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth, dir: 1, regions: null }] }, false); };
    const rect = (w, hh) => (sk, P) => { const q = [P(-w, -hh), P(w, -hh), P(w, hh), P(-w, hh)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); };
    const plate = part('Плита', (sk, P) => { rect(30, 15)(sk, P); const a = P(-15, 4), b2 = P(-15, -4), c = P(15, -4), d = P(15, 4), c1 = P(-15, 0), c2 = P(15, 0);
      sk.ents.s1 = { id: 's1', t: 'arc', c: c1, p1: a, p2: b2, r: 4 }; sk.ents.s2 = { id: 's2', t: 'line', p1: b2, p2: c }; sk.ents.s3 = { id: 's3', t: 'arc', c: c2, p1: c, p2: d, r: 4 }; sk.ents.s4 = { id: 's4', t: 'line', p1: d, p2: a }; }, 5);
    const pin = part('Штифт', (sk, P) => { sk.ents.c = { id: 'c', t: 'circle', c: P(0, 0), r: 3.5 }; }, 10);
    const cam = part('Кулачок', (sk, P) => { sk.ents.e = { id: 'e', t: 'ellipse', c: P(0, 0), p1: P(12, 0), r: 8 }; }, 5);
    const roller = part('Ролик', (sk, P) => { sk.ents.c = { id: 'c', t: 'circle', c: P(0, 0), r: 3 }; }, 5);
    const disc = part('Диск', (sk, P) => { sk.ents.c = { id: 'c', t: 'circle', c: P(0, 0), r: 10 }; }, 2);
    const box = part('Кубик', rect(2, 2), 4);
    R.addDoc('asm', 'Сборка', R.newAsm()); const asm = S.doc;
    for (const d of [plate, pin, cam, roller, disc, box]) R.asmInsert(d.id);
    const [cP, cPin, cCam, cRol, cDisc, cBox] = asm.comps; for (const c of [cP, cCam, cDisc]) c.fixed = true;
    cPin.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 5, 40, 3, 1]; cCam.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 80, 0, 0, 1]; cRol.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 100, 10, 0, 1]; cDisc.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, -60, 0, 1]; cBox.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 15, -45, 4, 1];
    const ref = (c, pick) => { const inf = R.docInfo(c.doc); const i = inf.ents.findIndex(pick); const e = inf.ents[i]; return { comp: c.id, kind: e.kind, p: e.p.toArray(), d: (e.n || e.d).toArray(), r: e.r, e: i }; };
    const add = (type, a, b2) => { const mr = R.mechRefs(type, a, b2); if (!mr) return 'no refs'; return R.tryAddMate(asm, { id: 'm' + asm.nid++, name: type, type, a: mr[0], b: mr[1], flip: false }).status; };
    const out = {};
    const slotEnd = ref(cP, (e) => e.kind === 'axis' && Math.abs(e.r - 4) < 1e-3); const pinCyl = ref(cPin, (e) => e.kind === 'axis' && Math.abs(e.r - 3.5) < 1e-3);
    out.slotOpts = R.mateOptions(pinCyl, slotEnd); out.slot = add('slot', pinCyl, slotEnd);
    const pinX = () => +R.poseOf(cPin).t.x.toFixed(2); out.pinX = pinX(); cPin.T[12] = 200; R.asmSolve(asm); out.pushedBack = pinX();
    const camTop = ref(cCam, (e) => e.kind === 'plane' && e.n.z > 0.99); const rolCyl = ref(cRol, (e) => e.kind === 'axis' && Math.abs(e.r - 3) < 1e-3);
    out.camOpts = R.mateOptions(rolCyl, camTop); out.cam = add('cam', rolCyl, camTop);
    { const m = asm.mates.at(-1); const A = R.worldEnt(m.a, R.poseOf(cRol)), B = R.worldEnt(m.b, R.poseOf(cCam)); out.camRes = R.mateResiduals(m, A, B).map((v) => +v.toFixed(5)); }
    const T = R.edgeTopology(R.docInfo(cDisc.doc).geo, R.docInfo(cDisc.doc).cyls); const ci = T.circles.find((c) => c.c.z > 1);
    const edgeRef = { comp: cDisc.id, kind: 'axis', p: ci.c.toArray(), d: ci.n.toArray(), r: ci.r, edge: { t: 'circle', c: ci.c.toArray(), n: ci.n.toArray(), r: ci.r } };
    const v = R.edgeTopology(R.docInfo(cBox.doc).geo, []).verts[0]; const ptRef = { comp: cBox.id, kind: 'point', p: v.toArray(), d: [0, 0, 1] };
    out.pathOpts = R.mateOptions(ptRef, edgeRef); out.path = add('path', ptRef, edgeRef);
    { const w = v.clone().applyQuaternion(R.poseOf(cBox).q).add(R.poseOf(cBox).t); out.pathPt = [+Math.hypot(w.x, w.y + 60).toFixed(3), +w.z.toFixed(3)]; }
    R.asmRefresh(true); out.dof = S.asmAnalysis.dof; return out; })));
  console.log('expect slot ok with Паз offered, pinX in [-15,15], pushedBack 15; cam ok, residuals 0; path ok, point at radius 10 on z 2; dof 3 (slot) + 3 (cam) + 4 (path) = 10');
  console.log(logs.join('\n')); await b.close(); })();

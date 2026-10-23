// Assembly tangency: a cylinder's face against a plane defaults to «Касательность» and lies on it (axis parallel to
// the plane, a radius away, on the side it was on); two cylinders touch outside. A circular edge coincident with a
// plane lies on it instead of standing in it edge-on.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    const part = (name, build, depth) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; build(sk, P);
      return R.addDoc('part', name, { name, nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth, dir: 1, regions: null }] }, false); };
    const rect = (w, hh) => (sk, P) => { const q = [P(-w, -hh), P(w, -hh), P(w, hh), P(-w, hh)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); };
    const plate = part('Плита', rect(30, 15), 5);
    const pin = part('Штифт', (sk, P) => { sk.ents.c = { id: 'c', t: 'circle', c: P(0, 0), r: 3 }; }, 20);
    const pin2 = part('Штифт2', (sk, P) => { sk.ents.c = { id: 'c', t: 'circle', c: P(0, 0), r: 4 }; }, 20);
    const disc = part('Диск', (sk, P) => { sk.ents.c = { id: 'c', t: 'circle', c: P(0, 0), r: 6 }; }, 2);
    R.addDoc('asm', 'Сборка', R.newAsm()); const asm = S.doc;
    for (const d of [plate, pin, pin2, disc]) R.asmInsert(d.id);
    const [cP, cPin, cPin2, cDisc] = asm.comps; cP.fixed = true;
    cPin.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 5, 40, 30, 1]; cPin2.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 40, 40, 30, 1]; cDisc.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -40, -40, 20, 1];
    const ref = (c, pick) => { const inf = R.docInfo(c.doc); const i = inf.ents.findIndex(pick); const e = inf.ents[i]; return { comp: c.id, kind: e.kind, p: e.p.toArray(), d: (e.n || e.d).toArray(), r: e.r, e: i }; };
    const out = {};
    const top = ref(cP, (e) => e.kind === 'plane' && e.n.z > 0.99); const cyl = ref(cPin, (e) => e.kind === 'axis' && Math.abs(e.r - 3) < 1e-3); const cyl2 = ref(cPin2, (e) => e.kind === 'axis' && Math.abs(e.r - 4) < 1e-3);
    out.opts = R.mateOptions(cyl, top);
    S.pm = { kind: 'mate', picks: [cyl, top], type: null, flip: null, v: null, side: null, before: null };
    const add = (type, a, b2, side) => R.tryAddMate(asm, { id: 'm' + asm.nid++, name: type, type, a, b: b2, flip: false, side }).status;
    out.t1 = add('tangent', cyl, top, 1);
    { const ps = R.poseOf(cPin); const w = R.worldEnt(cyl, ps); out.axisZ = +w.p.z.toFixed(3); out.axisDz = +w.d.z.toFixed(4); }
    out.t2 = add('tangent', cyl2, cyl, 1);
    { const A = R.worldEnt(cyl, R.poseOf(cPin)), B = R.worldEnt(cyl2, R.poseOf(cPin2)); const sep = B.p.clone().sub(A.p); out.axDist = +sep.addScaledVector(A.d, -sep.dot(A.d)).length().toFixed(3); }
    const T = R.edgeTopology(R.docInfo(cDisc.doc).geo, R.docInfo(cDisc.doc).cyls); const ci = T.circles.find((c) => c.c.z < 1);
    const edgeRef = { comp: cDisc.id, kind: 'axis', p: ci.c.toArray(), d: ci.n.toArray(), r: ci.r, edge: { t: 'circle', c: ci.c.toArray(), n: ci.n.toArray(), r: ci.r } };
    out.edgeOpts = R.mateOptions(edgeRef, top); out.e1 = add('coincident', edgeRef, top);
    { const w = R.worldEnt(edgeRef, R.poseOf(cDisc)); out.edge = [+w.p.z.toFixed(3), +Math.abs(w.d.z).toFixed(4)]; }
    // A pin standing at 30° to the plate's top: a quarter turn the right way, then tangency.
    R.asmInsert(pin.id); const c5 = asm.comps.at(-1); const q = Math.PI / 6; c5.T = [1, 0, 0, 0, 0, Math.cos(q), Math.sin(q), 0, 0, -Math.sin(q), Math.cos(q), 0, -20, 30, 40, 1];
    const cyl5 = { ...cyl, comp: c5.id }; out.t5 = add('tangent', cyl5, top, 1); { const w = R.worldEnt(cyl5, R.poseOf(c5)); out.ax5 = [+w.p.z.toFixed(3), +w.d.z.toFixed(4)]; }
    S.pm = null; return out; })));
  console.log('expect opts[0] tangent; t1 ok, axisZ 8 (top 5 + r 3), axisDz 0; t2 ok, axDist 7; edgeOpts no tangent; e1 ok, edge [5, 1]; t5 ok, ax5 [8, 0]');
  console.log(logs.join('\n')); await b.close(); })();

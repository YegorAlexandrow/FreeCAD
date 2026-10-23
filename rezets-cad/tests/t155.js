// Mates on a component's own planes (Спереди / Сверху / Справа): picked from the panel list, they hold the part
// (a pin centred on the plate by two plane mates and standing on its top is fully defined) and survive a part rebuild.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    const part = (name, build, depth) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; build(sk, P);
      return R.addDoc('part', name, { name, nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth, dir: 1, regions: null }] }, false); };
    const rect = (w, hh) => (sk, P) => { const q = [P(-w, -hh), P(w, -hh), P(w, hh), P(-w, hh)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); };
    const plate = part('Плита', rect(30, 15), 5); const pin = part('Штифт', (sk, P) => { sk.ents.c = { id: 'c', t: 'circle', c: P(0, 0), r: 3 }; }, 20);
    R.addDoc('asm', 'Сборка', R.newAsm()); const asm = S.doc; R.asmInsert(plate.id); R.asmInsert(pin.id); const [cP, cPin] = asm.comps; cP.fixed = true;
    cPin.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 7, 40, 30, 1]; const o = {};
    const add = (type, a, b2, extra = {}) => R.tryAddMate(asm, { id: 'm' + asm.nid++, name: type, type, a, b: b2, flip: false, ...extra }).status;
    const ref = (c, pick) => { const inf = R.docInfo(c.doc); const i = inf.ents.findIndex(pick); const e = inf.ents[i]; return { comp: c.id, kind: e.kind, p: e.p.toArray(), d: (e.n || e.d).toArray(), r: e.r, e: i }; };
    o.m1 = add('coincident', R.stdPlaneRef(cPin, 'right'), R.stdPlaneRef(cP, 'right'));
    o.m2 = add('coincident', R.stdPlaneRef(cPin, 'top'), R.stdPlaneRef(cP, 'top'));
    o.m3 = add('coincident', R.stdPlaneRef(cPin, 'front'), ref(cP, (e) => e.kind === 'plane' && e.n.z > 0.99), { flip: true });
    R.asmRefresh(true); const ps = R.poseOf(cPin); o.pos = ps.t.toArray().map((v) => +v.toFixed(3)); o.dof = S.asmAnalysis.dof; o.broken = asm.mates.filter((m) => m.broken).length; return o; })));
  console.log('expect m1 m2 m3 ok; pin at [0,0,5]; dof 0; broken 0');
  console.log(logs.join('\n')); await b.close(); })();

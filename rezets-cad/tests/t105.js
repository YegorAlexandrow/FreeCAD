// A circle drawn on a model circle's centre gets its own centre point tied by a coincident relation, which can be
// deleted; an older sketch whose circle shares the model point is split off with «Отвязать от модели».
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(-20, -20), P(20, -20), P(20, 20), P(-20, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); sk.ents.h = { id: 'h', t: 'circle', c: P(0, 0), r: 6 };
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 5, dir: 1, regions: null }] });
    R.startSketch({ label: 'Грань', o: [0, 0, 5], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1], face: { by: 'f2', d: 5 } }); const s2 = S.doc.features.find((f) => f.id === S.editing).sk;
    const ci = S.refs.circles.findIndex((c) => Math.abs(c.r - 6) < 1e-6); const ek = R.materialize(s2, 'r:c:' + ci); const fp = s2.ents[ek.slice(2)].c;
    const pend = []; const c = R.snapToPoint(s2, { kind: 'pt', ref: fp }, pend); const out = { own: c !== fp, rel: pend.map((x) => x.t) };
    // old-style: a circle sharing the model point
    const id = 'z'; s2.ents[id] = { id, t: 'circle', c: fp, r: 2 }; R.detachFromModel(s2, fp); out.detached = s2.ents.z.c !== fp && !s2.pts[s2.ents.z.c].fixed;
    return out; })));
  console.log('expect own true, rel [coincident], detached true');
  console.log(logs.join('\n')); await b.close(); })();

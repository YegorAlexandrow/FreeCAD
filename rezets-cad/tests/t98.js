// A chamfer on a hole rim survives a change of the hole's diameter: the rim on the same axis, on the same side, is
// taken whatever its radius; an edge that is truly gone no longer takes the other edges' chamfers with it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(-10, -10), P(10, -10), P(10, 10), P(-10, 10)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); const c = P(0, 0); sk.ents.h = { id: 'h', t: 'circle', c, r: 3 };
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 5, dir: 1, regions: null },
      { id: 'f3', type: 'chamfer', name: 'Фаска1', d: 0.6, edges: [{ t: 'circle', c: [0, 0, 5], n: [0, 0, 1], r: 3 }, { t: 'line', a: [-10, -10, 5], b: [10, -10, 5] }] }] });
    const v3 = R.geoVolume(R.S.body); const err3 = R.S.errors;
    R.S.doc.features[0].sk.ents.h.r = 4; R.rebuild(); const e = R.S.doc.features[2].edges[0];
    const out = { err3, err4: R.S.errors, rim: [e.r, e.c[2]] };
    // an edge that is not on the body at all: the other one still gets its chamfer
    R.S.doc.features[2].edges.push({ t: 'line', a: [50, 50, 50], b: [60, 50, 50] }); R.rebuild(); out.partialErr = R.S.errors.f3; out.stillCut = +(Math.PI * 16 * 5 - 0 > 0 && R.geoVolume(R.S.body)).toFixed(1);
    return out; })));
  console.log('expect no errors at r 3 and r 4, the rim followed to r 4 at z 5; with a lost edge a message saying 1 of 3 is lost and the body still chamfered');
  console.log(logs.join('\n')); await b.close(); })();

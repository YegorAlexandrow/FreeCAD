// N33: an extrusion of the right one of two rectangles stays on it when a line added to the sketch splits the left one
// (the regions are renumbered).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const rect = (x0, x1, n) => { const q = [P(x0, 0), P(x1, 0), P(x1, 10), P(x0, 10)]; q.forEach((a, i) => { sk.ents[n + i] = { id: n + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); };
    rect(-20, -10, 'a'); rect(15, 25, 'b');
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 5, dir: 1, regions: null }] });
    const reg = R.sketchRegionsOf(R.featById('f1')); const right = reg.faces.find((r) => r.sample[0] > 0).id; R.featById('f2').regions = [right]; R.rebuild();
    const bb = () => { S.body.computeBoundingBox(); const q = S.body.boundingBox; return [+q.min.x.toFixed(1), +q.max.x.toFixed(1)]; }; const b0 = bb();
    const s1 = R.featById('f1').sk; const u = P(-15, 0), v = P(-15, 10); s1.ents.cut = { id: 'cut', t: 'line', p1: u, p2: v }; R.rebuild();
    return { b0, b1: bb(), regions: R.featById('f2').regions, err: JSON.stringify(S.errors) }; })));
  console.log('expect b0 = b1 = [15, 25], no errors');
  console.log(logs.join('\n')); await b.close(); })();

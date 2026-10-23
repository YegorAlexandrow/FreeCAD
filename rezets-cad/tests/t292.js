// Polygons: inscribed or circumscribed; a drawn one changes its number of sides and kind from the panel, on the same
// construction circle.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk: R.newSketchData() }] }); R.editFeature(S.doc.features[0]);
    const sk = S.doc.features[0].sk; const c = String(sk.nid++); sk.pts[c] = { id: c, x: 0, y: 0 };
    const info = () => { R.solveSketch(sk); const ls = Object.values(sk.ents).filter((e) => e.t === 'line' && e.poly); const circ = Object.values(sk.ents).find((e) => e.t === 'circle'); const d = (id) => Math.hypot(sk.pts[id].x, sk.pts[id].y);
      return { n: ls.length, r: +circ.r.toFixed(3), corner: +d(ls[0].p1).toFixed(3), side: +Math.hypot(sk.pts[ls[0].p2].x - sk.pts[ls[0].p1].x, sk.pts[ls[0].p2].y - sk.pts[ls[0].p1].y).toFixed(3) }; };
    S.toolOpt.polyMode = 'out'; R.makePolygon(sk, c, 10, 0, 6); const out6 = info();
    const circ = Object.values(sk.ents).find((e) => e.t === 'circle').id; R.rebuildPolygon(sk, circ, 4, 'in'); const in4 = info();
    return { out6, in4 }; });
  console.log(JSON.stringify(r)); console.log('expect out6: n 6, r 10, corner 11.547 (10/cos30°), side 11.547; in4: n 4, r 10, corner 10, side 14.142');
  console.log(logs.join('\n')); await b.close(); })();

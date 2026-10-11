const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const r = await p.evaluate(() => {
    const R = window.__rezets; const S = R.S; const out = {};
    // sketch on the front face of the plate (z = 40), circle d5, through-all cut
    const sk = R.newSketchData(); sk.pts['1'] = { id: '1', x: -25, y: 6 }; sk.ents['2'] = { id: '2', t: 'circle', c: '1', r: 2.5 }; sk.nid = 3;
    const sf = { id: 'fx1', type: 'sketch', name: 'Эскиз5', plane: { label: 'Грань', o: [0, 0, 40], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] }, sk };
    S.doc.features.push(sf); const f = { id: 'fx2', type: 'extrude', name: 'Вырез3', sketch: 'fx1', mode: 'cut', end: 'through', depth: 20, dir: -1, regions: null };
    let t = performance.now(); const tool = R.buildTool(f, S.body); out.tool = performance.now() - t;
    t = performance.now(); const res = R.boolean(S.body, tool, 2); out.csg = performance.now() - t; out.tris = res.getAttribute('position').count / 3;
    t = performance.now(); const e = R.featureEdges(res); out.edges = performance.now() - t;
    window.__prof = {}; t = performance.now(); S.doc.features.push(f); R.rebuild(); out.prof = window.__prof; out.rebuild = performance.now() - t;
    return out;
  });
  console.log(JSON.stringify(r));
  await b.close();
})();

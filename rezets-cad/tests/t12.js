const open = require('./harness.js');
(async () => {
  const { b, p } = await open();
  const r = await p.evaluate(() => { const R = window.__rezets; R.cmdMeasure(); const T = R.bodyTopo();
    const bad = T.verts.filter(v => T.circles.some(c => Math.abs(v.distanceTo(c.c) - c.r) < 1e-2 && Math.abs(v.clone().sub(c.c).dot(c.n)) < 1e-2));
    return { verts: T.verts.length, lines: T.lines.length, circles: T.circles.length, spurious: bad.map(v => v.toArray().map(x => +x.toFixed(3))) }; });
  console.log(JSON.stringify(r)); await b.close();
})();

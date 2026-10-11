const open = require('./harness.js');
(async () => {
  const { b, p } = await open();
  const r = await p.evaluate(() => { const R = window.__rezets; const T = R.bodyTopo(); return { cyls: R.S.cyls.length, circles: T.circles.map(c => [+(2*c.r).toFixed(3), +c.c.x.toFixed(4), +c.c.y.toFixed(4), +c.c.z.toFixed(4), c.n.toArray().map(v=>+v.toFixed(3)).join('/')]) }; });
  console.log(JSON.stringify(r)); await b.close();
})();

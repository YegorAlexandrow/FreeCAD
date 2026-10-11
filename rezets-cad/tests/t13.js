const open = require('./harness.js');
(async () => {
  const { b, p } = await open();
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const e = R.featureEdges(S.body); const out = [];
    for (let i = 0; i < e.length; i += 6) { const a = [e[i], e[i+1], e[i+2]], b = [e[i+3], e[i+4], e[i+5]]; const near = (q) => Math.abs(Math.hypot(q[0] + 45, q[2] + 25) - 5) < 0.01 && Math.abs(q[1]) < 0.01; if (near(a) !== near(b) && (near(a) || near(b))) out.push([a.map(x=>+x.toFixed(3)), b.map(x=>+x.toFixed(3)), +Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]).toFixed(4)]); }
    return { total: e.length / 6, offRim: out.slice(0, 12), n: out.length }; });
  console.log(JSON.stringify(r)); await b.close();
})();

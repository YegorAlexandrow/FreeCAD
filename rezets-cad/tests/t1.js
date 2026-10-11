const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const info = await p.evaluate(() => { const S = window.__rezets.S; const vol = () => { if(!S.body) return 0; const p=S.body.getAttribute('position'); let v=0; for(let i=0;i<p.count;i+=3){ const a=[p.getX(i),p.getY(i),p.getZ(i)], b=[p.getX(i+1),p.getY(i+1),p.getZ(i+1)], c=[p.getX(i+2),p.getY(i+2),p.getZ(i+2)]; v += a[0]*(b[1]*c[2]-b[2]*c[1]) - a[1]*(b[0]*c[2]-b[2]*c[0]) + a[2]*(b[0]*c[1]-b[1]*c[0]); } return v/6; };
    return { feats: S.doc.features.map(f => f.name), errors: S.errors, tris: S.body ? S.body.getAttribute('position').count/3 : 0, vol: vol() }; });
  const exp = 120*80*12 + Math.PI*22*22*20 - Math.PI*12*12*32 - 2*Math.PI*5*5*12;
  console.log(JSON.stringify(info), 'expected vol ~', exp.toFixed(0));
  await p.screenshot({ path: 'shot1.png' });
  console.log(logs.join('\n'));
  await b.close();
})();

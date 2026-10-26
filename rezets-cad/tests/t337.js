// The camera holder ARM3 v2, built on faces of itself: the lever made 2 mm wider and taller (Эскиз1, «Рычаг») carries
// the walls, bottom, lips and holes with it, and the fillet keeps all its edges, each over its new full length.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/arm3-linked.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild(); const errs = () => Object.entries(S.errors).filter(([k, e]) => e && S.doc.features.some((f) => f.id === k)).map(([k, e]) => R.featById(k).name + ': ' + e);
    const s1 = S.doc.features[0]; Object.values(s1.sk.cons).find((c) => c.t === 'dy').v += 2; R.solveSketch(s1.sk); S.doc.features.find((f) => f.name === 'Рычаг').depth = 2.5; R.rebuild();
    const fl = S.doc.features.find((f) => f.type === 'fillet'); const zs = [...new Set(fl.edges.flatMap((e) => [e.a[2], e.b[2]]).map((z) => Math.abs(+z.toFixed(2))))];
    const vert = fl.edges.filter((e) => Math.abs(e.a[1] - e.b[1]) > 1).map((e) => +Math.abs(e.a[1] - e.b[1]).toFixed(2));
    return { errs: errs(), bodies: S.body.userData.bodies?.n, zs, vert, dangling: S.dangling.size }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect errs [], bodies 1, zs [9.66], vert lengths 22.58 (bottom to the lever top) and 20.08 (bottom to the lever), dangling 0');
  console.log(logs.join('\n')); await b.close(); })();

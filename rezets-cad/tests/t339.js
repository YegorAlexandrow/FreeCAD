// ARM3 v2 with a sliding cover: the lever made 2 mm wider, the cover follows the lever's edge and stays a body of its
// own. Its corner at the USB end had a twin at the groove's edge, nearer to where it was (0.75 against 1): it went
// there and the cover grew into the lever.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/arm3-cover.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild();
    const s1 = S.doc.features[0]; Object.values(s1.sk.cons).find((c) => c.t === 'dy').v += 2; R.solveSketch(s1.sk); R.rebuild();
    const cover = S.doc.features.find((f) => f.name === 'Эскиз8'); const zs = Object.values(cover.sk.pts).filter((q) => q.mref).map((q) => q.mref.w[2]);
    const errs = Object.entries(S.errors).filter(([k, e]) => e && S.doc.features.some((f) => f.id === k)).length;
    return { bodies: S.body.userData.bodies?.n, zs, errs }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect bodies 2, zs [9.91, 9.91], errs 0');
  console.log(logs.join('\n')); await b.close(); })();

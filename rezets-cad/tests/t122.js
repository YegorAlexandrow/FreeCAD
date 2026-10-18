// An ellipse offsets (the axes grow by the offset, same centre and direction, kept by an 'eoff' dimension that can be
// edited) and takes both axis lengths from fields in its panel.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [] }); R.startSketch({ ...R.PLANES.front }); const sk = S.doc.features.find((f) => f.id === S.editing).sk;
    sk.pts.c = { id: 'c', x: 0, y: 0 }; sk.pts.a = { id: 'a', x: 8, y: 0 }; sk.ents.e = { id: 'e', t: 'ellipse', c: 'c', p1: 'a', r: 3 };
    S.sel = new Set(['e:e']); R.commitSketch(); const fields = [...document.querySelectorAll('#side label.field')].map((x) => x.textContent.replace(/\\s+/g, ' ').trim());
    const set = (label, v) => { const l = [...document.querySelectorAll('#side label.field')].find((x) => x.textContent.startsWith(label)); const i = l.querySelector('input'); i.value = v; i.dispatchEvent(new Event('change')); };
    set('Большая ось', '20'); set('Малая ось', '8'); const A = Math.hypot(sk.pts.a.x - sk.pts.c.x, sk.pts.a.y - sk.pts.c.y);
    const err = R.applyOffset(sk, ['e'], 1.5, false); const ne = Object.values(sk.ents).find((x) => x.t === 'ellipse' && x.id !== 'e'); const C = sk.pts.c; const nA = Math.hypot(sk.pts[ne.p1].x - C.x, sk.pts[ne.p1].y - C.y), nR = ne.r;
    const k = Object.values(sk.cons).find((x) => x.t === 'eoff'); k.v = 2; R.solveSketch(sk); const nA2 = Math.hypot(sk.pts[ne.p1].x - sk.pts.c.x, sk.pts[ne.p1].y - sk.pts.c.y);
    return { fields, axes: [+(2 * A).toFixed(3), 2 * sk.ents.e.r], err, off: [+nA.toFixed(3), +nR.toFixed(3)], edited: [+nA2.toFixed(3), +ne.r.toFixed(3)], regions: R.sketchRegionsOf(S.doc.features[0]).faces.length }; })));
  console.log('expect fields Большая/Малая ось, axes [20, 8], err null, off [11.5, 5.5], edited [12, 6], regions 2');
  console.log(logs.join('\n')); await b.close(); })();

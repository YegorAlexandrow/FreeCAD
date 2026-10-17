// An angle between two lines is the angle of the sector the dimension is placed in: a ray up and a ray at -30°
// (drawn towards the centre) read 120° placed between them on the right, 60° on the other side.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [] }); R.startSketch({ ...R.PLANES.front }); const sk = S.doc.features.find((f) => f.id === S.editing).sk;
    const c = Math.cos(-Math.PI / 6), s = Math.sin(-Math.PI / 6);
    sk.pts.o = { id: 'o', x: 0, y: 0 }; sk.pts.u = { id: 'u', x: 0, y: 20 }; sk.pts.f = { id: 'f', x: 20 * c, y: 20 * s }; sk.pts.g = { id: 'g', x: 5 * c, y: 5 * s };
    sk.ents.a = { id: 'a', t: 'line', p1: 'o', p2: 'u' }; sk.ents.b = { id: 'b', t: 'line', p1: 'f', p2: 'g' };
    const at = (u, v) => { const k = R.makeDim(sk, ['e:a', 'e:b'], { u, v }); R.initSigns ? 0 : 0; return k; };
    const out = {}; for (const [nm, u, v] of [['right', 15, 5], ['left', -5, 10], ['below', 3, -15]]) { const k = at(u, v); k.id = 'x'; sk.cons.x = k; out[nm] = +window.__rezets.measure(sk, k).toFixed(2); delete sk.cons.x; }
    const k = at(15, 5); k.id = 'k'; k.v = 90; R.tryAddConstraint(sk, k); R.solveSketch(sk); out.after90 = +R.measure(sk, sk.cons.k).toFixed(2);
    return out; })));
  console.log('expect right 120, left 60, below 60, after90 90');
  console.log(logs.join('\n')); await b.close(); })();

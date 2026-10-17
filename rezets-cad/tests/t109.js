// An ellipse takes both axis lengths as dimensions (the one nearer the click) and a horizontal or vertical axis;
// with its centre on the origin it is fully defined.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [] }); R.startSketch({ ...R.PLANES.front }); const sk = S.doc.features.find((f) => f.id === S.editing).sk;
    sk.pts.c = { id: 'c', x: 1, y: 1 }; sk.pts.a = { id: 'a', x: 9, y: 3 }; sk.ents.e = { id: 'e', t: 'ellipse', c: 'c', p1: 'a', r: 3 };
    const major = R.makeDim(sk, ['e:e'], { u: 9.5, v: 3 }), minor = R.makeDim(sk, ['e:e'], { u: 0.3, v: 4 });
    const out = { major: major?.t, minor: minor?.t };
    R.tryAddConstraint(sk, { id: 'k1', ...major, v: 20 }); R.tryAddConstraint(sk, { id: 'k2', ...minor, v: 8 }); R.tryAddConstraint(sk, { id: 'k3', t: 'horizontal', refs: ['e'] }); R.tryAddConstraint(sk, { id: 'k4', t: 'coincident', refs: ['c', 'O'] });
    R.solveSketch(sk); const a = R.analyzeSketch(sk); const P = sk.pts;
    out.c = [+P.c.x.toFixed(3), +P.c.y.toFixed(3)]; out.a = [+P.a.x.toFixed(3), +P.a.y.toFixed(3)]; out.r = +sk.ents.e.r.toFixed(3); out.dof = a.dofMain;
    S.sel = new Set(['e:e']); out.opts = R.relationOptions(sk).map((o) => o[1]);
    window.__rezets.commitSketch(); return out; })));
  await p.waitForTimeout(800); console.log(JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('.dimlbl')].map((x) => x.textContent)))); await p.screenshot({ path: process.env.SHOT || '/tmp/ell.png' });
  console.log('expect major emaj, minor diam; c [0,0], a [±10,0], r 4, dof 0; opts include Ось горизонтально/вертикально; labels 20 and 8 (no ⌀)');
  console.log(logs.join('\n')); await b.close(); })();

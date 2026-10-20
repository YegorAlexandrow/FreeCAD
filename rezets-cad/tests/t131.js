// STL export makes the mesh watertight: a box with a T-junction and a box with a missing triangle have
// non-manifold edges; after watertight() none; a normal part has none and passes untouched.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  await p.waitForFunction(() => window.__rezets.manifoldOn(), null, { timeout: 30000 });
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const T = window.THREE || null; void T;
    const box = R.S.body.clone(); const out = { sample: R.badEdges(box) };
    const pos = Array.from(box.getAttribute('position').array);
    // missing triangle
    const g1 = box.clone(); g1.setAttribute('position', new (box.getAttribute('position').constructor)(new Float32Array(pos.slice(9)), 3));
    out.hole = R.badEdges(g1); const w1 = R.watertight(g1); out.holeFixed = w1.bad;
    // T-junction: split the first triangle at the midpoint of its first edge into two
    const a = pos.slice(0, 3), b2 = pos.slice(3, 6), c = pos.slice(6, 9); const m = a.map((v, i) => (v + b2[i]) / 2);
    const g2 = box.clone(); g2.setAttribute('position', new (box.getAttribute('position').constructor)(new Float32Array([...a, ...m, ...c, ...m, ...b2, ...c, ...pos.slice(9)]), 3));
    out.tj = R.badEdges(g2); const w2 = R.watertight(g2); out.tjFixed = w2.bad; out.vol = [+R.geoVolume(box).toFixed(1), +R.geoVolume(w2.geo).toFixed(1)];
    return out; })));
  console.log('expect sample 0; hole > 0, holeFixed 0; tj > 0, tjFixed 0; vol equal');
  console.log(logs.join('\n')); await b.close(); })();

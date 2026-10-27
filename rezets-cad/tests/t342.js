// ARM3 (built on its own faces): «Стенки» made deeper and back, Эскиз1's dimensions 22 and 23 changed and back, each
// on a fresh copy. The part comes back exactly: before, a lip tied by an equal length came back mirrored (2.3 mm off,
// 15 mm³ less) and lever dimensions left points 2 mm off, because each rebuild solved sketches from what the last one
// left instead of from what the user drew.
const open = require('./harness.js'); const fs = require('fs');
const src = fs.readFileSync(__dirname + '/data/arm3-linked.json', 'utf8');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((src) => { const R = window.__rezets; const S = R.S; const out = {};
    const pts = () => JSON.stringify(S.doc.features.filter((f) => f.sk).map((f) => Object.values(f.sk.pts).map((q) => [+q.x.toFixed(4), +q.y.toFixed(4)])));
    const trip = (name, get, set) => { R.loadDoc(JSON.parse(src)); R.rebuild(); const p0 = pts(), v0 = R.geoVolume(S.body); const v = get(); set(v + Math.max(0.25, Math.abs(v) * 0.08)); R.rebuild(); set(v); R.rebuild(); out[name] = { back: pts() === p0, dv: +(R.geoVolume(S.body) - v0).toFixed(4) }; };
    const F = (n) => S.doc.features.find((x) => x.name === n);
    trip('Стенки', () => F('Стенки').depth, (v) => { F('Стенки').depth = v; });
    for (const id of ['22', '23']) trip('Эскиз1#' + id, () => F('Эскиз1').sk.cons[id].v, (v) => { F('Эскиз1').sk.cons[id].v = v; R.solveSketch(F('Эскиз1').sk); });
    return out; }, src);
  console.log(JSON.stringify(r)); console.log('expect each back true, dv 0');
  console.log(logs.join('\n')); await b.close(); })();

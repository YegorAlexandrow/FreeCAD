// A profile open by 0.75 mm (Деталь 12, Эскиз5: a line ends at (21; 0), the arc next to it starts at (21; -0.75)).
// The extrude says where the gap is; in the sketch the open ends are listed and «Замкнуть разрывы» joins them.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/part12-gap.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild(); const f = S.doc.features.find((x) => x.name === 'Эскиз5');
    const out = { regions0: R.sketchRegionsOf(f).faces.length };
    S.selectedTree = 'feat:' + f.id; R.cmdFeature('extrude', 'add'); out.toast = [...document.querySelectorAll('.toast')].map((t) => t.textContent).pop();
    R.editFeature(f); out.panel = [...document.querySelectorAll('.note')].map((t) => t.textContent).find((t) => /не замкнут/.test(t));
    const btn = [...document.querySelectorAll('button')].find((x) => /Замкнуть разрывы/.test(x.textContent)); out.btn = btn?.textContent; btn?.click();
    out.regions1 = R.sketchRegionsOf(f).faces.length; out.panelAfter = [...document.querySelectorAll('.note')].some((t) => /не замкнут/.test(t.textContent));
    const pts = Object.values(f.sk.pts).filter((q) => Math.abs(q.x - 21) < 0.01).map((q) => +q.y.toFixed(3)); out.at21 = pts; out.lines = Object.values(f.sk.ents).filter((e) => e.t === 'line').length;
    // Free ends 0.3 mm apart: joined into one point, no extra line.
    R.exitSketch(); const g = { id: 'f99', type: 'sketch', name: 'Эскиз99', plane: R.PLANES.top, sk: R.newSketchData() }; S.doc.features.push(g); const k = g.sk;
    const P = [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0.3]]; P.forEach(([x, y], i) => { k.pts['p' + i] = { id: 'p' + i, x, y }; }); for (let i = 0; i < 4; i++) k.ents['l' + i] = { id: 'l' + i, t: 'line', p1: 'p' + i, p2: 'p' + (i + 1) };
    R.rebuild(); R.editFeature(g); const n0 = Object.keys(k.ents).length; [...document.querySelectorAll('button')].find((x) => /Замкнуть разрывы/.test(x.textContent))?.click();
    out.free = { regions: R.sketchRegionsOf(g).faces.length, extraEnts: Object.keys(k.ents).length - n0, gap: +Math.hypot(k.pts.p4.x - k.pts.p0.x, k.pts.p4.y - k.pts.p0.y).toFixed(6) }; return out; }, doc);
  console.log(JSON.stringify(r)); console.log('expect regions0 0, toast and panel naming the 0.75 mm gap, regions1 1, panelAfter false, at21 unchanged, lines one more; free: regions 1, extraEnts 0, gap 0');
  console.log(logs.join('\n')); await b.close(); })();

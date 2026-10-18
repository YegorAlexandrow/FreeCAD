// A revolve opened on one sketch takes another from the «Эскиз» list in its panel (the user's Деталь 2: a groove
// sketch Эскиз2 and a new rectangle sketch to revolve).
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/gear_part2.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; doc.features = doc.features.filter((f) => f.type !== 'stepbody' && f.type !== 'revolve' && f.type !== 'extrude' && f.type !== 'hole');
    const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(-20, -1), P(-14, -1), P(-14, -3), P(-20, -3)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); const ax = P(0, 0), ay = P(0, 9); sk.ents.ax = { id: 'ax', t: 'line', p1: ax, p2: ay, constr: true };
    doc.features.push({ id: 'f90', type: 'sketch', name: 'Эскиз4', plane: R.PLANES.front, sk }); R.loadDoc(doc);
    S.selectedTree = 'feat:f4'; R.cmdFeature('revolve', 'add'); const out = { first: S.pm.feature.sketch };
    const sel = document.getElementById('pmSketch'); out.options = sel ? [...sel.options].map((o) => o.textContent) : null;
    sel.value = 'f90'; sel.dispatchEvent(new Event('change')); out.after = [S.pm.feature.sketch, S.pm.regionsOf, S.pm.feature.axis];
    R.okPM(); out.err = JSON.stringify(S.errors); out.vol = +R.geoVolume(S.body).toFixed(1); return out; }, doc)));
  console.log('expect first f4, options include Эскиз2 and Эскиз4, after [f90,f90,ax], no errors, vol = 2*pi*17*12 ~ 1282');
  console.log(logs.join('\n')); await b.close(); })();

// S0-27: pointing at a relation's glyph lights the geometry it ties; moving off onto the sketch puts it out.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(0, 0), c = P(30, 0), d = P(0, 20), e = P(30, 20); sk.ents.l1 = { id: 'l1', t: 'line', p1: a, p2: c }; sk.ents.l2 = { id: 'l2', t: 'line', p1: d, p2: e };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); const k = R.featById('f1').sk;
    R.tryAddConstraint(k, { id: 'pp', t: 'parallel', refs: ['l1', 'l2'] }); R.commitSketch(); });
  await p.waitForTimeout(400); const g = await p.$$eval('.glyph', (e) => e.map((x) => { const r = x.getBoundingClientRect(); return [x.textContent, r.x + r.width / 2, r.y + r.height / 2]; }));
  const par = g.find((x) => x[0] === '∥') || g[0]; await p.mouse.move(par[1], par[2], { steps: 3 }); await p.waitForTimeout(200); const on = await p.evaluate(() => window.__rezets.S.relHover);
  await p.mouse.move(80, 500, { steps: 3 }); await p.waitForTimeout(200); const off = await p.evaluate(() => window.__rezets.S.relHover);
  console.log(JSON.stringify({ glyphs: g.map((x) => x[0]), on, off })); console.log('expect on [e:l1, e:l2], off null');
  console.log(logs.join('\n')); await b.close(); })();

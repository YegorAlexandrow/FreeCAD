// An arc drawn with its end on a line's midpoint: the arc bends to reach it, the line that was there stays put.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1200);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    sk.ents.L = { id: 'L', t: 'line', p1: P(0, 0), p2: P(20, 0) };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); });
  await p.waitForTimeout(900);
  const box = await p.locator('#cv').boundingBox();
  const at = (x, y) => p.evaluate(([x, y]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, x, y)); }, [x, y]);
  await p.evaluate(() => window.__rezets.setTool('arc'));
  for (const [x, y] of [[25, 18], [25, 3]]) { const s = await at(x, y); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(150); }
  // sweep round to the midpoint (10, 0)
  for (const [x, y] of [[20, 8], [14, 6], [10.4, 0.6]]) { const s = await at(x, y); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 4 }); await p.waitForTimeout(80); }
  const m = await at(10, 0); await p.mouse.move(box.x + m.x, box.y + m.y, { steps: 2 }); await p.waitForTimeout(150); await p.mouse.click(box.x + m.x, box.y + m.y); await p.waitForTimeout(400);
  const out = await p.evaluate(() => { const R = window.__rezets; const sk = R.featById('f1').sk; const L = sk.ents.L; const a = sk.pts[L.p1], b2 = sk.pts[L.p2];
    const arc = Object.values(sk.ents).find((e) => e.t === 'arc'); const ends = arc ? [arc.p1, arc.p2].map((id) => [+sk.pts[id].x.toFixed(3), +sk.pts[id].y.toFixed(3)]) : null;
    return { line: [a.x, a.y, b2.x, b2.y].map((v) => +v.toFixed(3)), arc: !!arc, ends, cons: Object.values(sk.cons).map((c) => c.t) }; });
  console.log(JSON.stringify(out));
  console.log('expect line [0,0,20,0] unchanged, arc true with one end at [10,0], a midpoint relation');
  console.log(logs.join('\n')); await b.close(); })();

// S0-18: in the trim tool a drag trims every piece it crosses; Shift+click extends a line to the next curve.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; }; const L = (id, a, c) => { sk.ents[id] = { id, t: 'line', p1: a, p2: c }; };
    P('a', 0, 0); P('b', 30, 0); L('A', 'a', 'b'); P('c', 10, -5); P('d', 10, 5); L('B', 'c', 'd'); P('e', 20, -5); P('f', 20, 5); L('C', 'e', 'f');
    P('g', 0, 20); P('h', 5, 20); L('E', 'g', 'h'); P('i', 15, 10); P('j', 15, 30); L('W', 'i', 'j'); sk.nid = 100;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); R.setTool('trim'); });
  await p.waitForTimeout(400); const box = await (await p.$('#cv')).boundingBox();
  const scr = async (u, v) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]); return [box.x + s.x, box.y + s.y]; };
  const s0 = await scr(15, 3), s1 = await scr(15, -3); await p.mouse.move(...s0); await p.mouse.down(); await p.mouse.move(...s1, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(200);
  const e0 = await scr(4.5, 20); await p.keyboard.down('Shift'); await p.mouse.click(...e0); await p.keyboard.up('Shift'); await p.waitForTimeout(200);
  console.log(JSON.stringify(await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; const xs = Object.values(sk.ents).filter((e) => e.t === 'line' && [sk.pts[e.p1], sk.pts[e.p2]].every((q) => Math.abs(q.y) < 1e-6)).map((e) => [sk.pts[e.p1].x, sk.pts[e.p2].x].map((v) => +v.toFixed(2)).sort((a, b) => a - b));
    return { pieces: xs.sort((a, b) => a[0] - b[0]), extended: +sk.pts.h.x.toFixed(3) }; })));
  console.log('expect pieces [[0,10],[20,30]] (the middle crossed by the drag gone), extended 15');
  console.log(logs.join('\n')); await b.close(); })();

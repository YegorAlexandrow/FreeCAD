// S0-13: an end of a line dragged onto another line's end snaps onto it and is joined to it (a coincident relation),
// as when it is drawn there; dragged onto empty space it just moves.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); sk.pts.a = { id: 'a', x: 0, y: 0 }; sk.pts.b = { id: 'b', x: 10, y: 0 }; sk.pts.c = { id: 'c', x: 20, y: 5 }; sk.pts.d = { id: 'd', x: 30, y: 5 };
    sk.ents.A = { id: 'A', t: 'line', p1: 'a', p2: 'b' }; sk.ents.B = { id: 'B', t: 'line', p1: 'c', p2: 'd' }; sk.nid = 50;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); R.setTool('select'); });
  await p.waitForTimeout(400); const box = await (await p.$('#cv')).boundingBox();
  const scr = (u, v) => p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]);
  const drag = async (from, to, off = 3) => { const a = await scr(...from), c = await scr(...to); await p.mouse.move(box.x + a.x, box.y + a.y); await p.mouse.down(); await p.mouse.move(box.x + c.x + off, box.y + c.y + off, { steps: 10 }); await p.mouse.up(); await p.waitForTimeout(200); };
  await drag([10, 0], [20, 5]);
  const r = await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; return { b: [sk.pts.b.x, sk.pts.b.y].map((v) => +v.toFixed(4)), joined: Object.values(sk.cons).some((c) => c.t === 'coincident' && c.refs.includes('b') && c.refs.includes('c')) }; });
  await drag([0, 0], [-10, -10], 0);
  const r2 = await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; return { cons: Object.values(sk.cons).filter((c) => c.refs.includes('a')).length }; });
  console.log(JSON.stringify({ ...r, ...r2 })); console.log('expect b [20,5], joined true, cons 0');
  console.log(logs.join('\n')); await b.close(); })();

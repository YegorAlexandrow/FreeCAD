// F3: drawing on a face, a line started at the middle of a model edge snaps there and stays there (a midpoint
// relation to the edge), with no conversion of the edge first.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(-20, -10), P(20, -10), P(20, 10), P(-20, 10)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Б', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null }] });
    R.startSketch({ label: 'Грань', o: [0, 0, 10], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1], face: { by: 'f2', d: 10 } }); R.setTool('line'); });
  await p.waitForTimeout(400); const box = await (await p.$('#cv')).boundingBox();
  const at = async (u, v) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; const f = R.featById(R.S.editing); return R.toScreen(R.toWorld(f.plane, u, v)); }, [u, v]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(150); };
  await at(0.6, -10.3); await at(5, 0); await p.keyboard.press('Escape');
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; const l = Object.values(sk.ents).find((e) => e.t === 'line' && !e.ext); const a = sk.pts[l.p1];
    return { start: [+a.x.toFixed(3), +a.y.toFixed(3)], mid: Object.values(sk.cons).filter((c) => c.t === 'midpoint').length }; })));
  console.log('expect start [0, -10], mid 1');
  console.log(logs.join('\n')); await b.close(); })();

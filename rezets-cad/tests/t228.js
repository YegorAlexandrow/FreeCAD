// F19/F21: the face-outline tool on a single model edge takes just that edge, as ordinary geometry that can close a
// profile with lines drawn to it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(-20, -10), P(20, -10), P(20, 10), P(-20, 10)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Б', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null }] });
    R.startSketch({ label: 'Грань', o: [0, 0, 10], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1], face: { by: 'f2', d: 10 } }); R.setTool('convert'); });
  await p.waitForTimeout(400); const box = await (await p.$('#cv')).boundingBox();
  const at = async (u, v) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; const f = R.featById(R.S.editing); return R.toScreen(R.toWorld(f.plane, u, v)); }, [u, v]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(200); };
  await at(5, -10);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; return Object.values(sk.ents).filter((e) => !e.ext).map((e) => [e.t, ...[e.p1, e.p2].map((id) => [sk.pts[id].x, sk.pts[id].y])]); })));
  console.log('expect one line from (-20,-10) to (20,-10)');
  console.log(logs.join('\n')); await b.close(); })();

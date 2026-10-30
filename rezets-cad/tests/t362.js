// H15: «До грани» refuses a face that runs along the extrusion (it can never be reached) when it is picked, with a
// word why, instead of taking it and failing the operation afterwards; a face across it is taken.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; };
    P('a', -20, -20); P('b', 20, -20); P('c', 20, 20); P('d', -20, 20); [['A', 'a', 'b'], ['B', 'b', 'c'], ['C', 'c', 'd'], ['D', 'd', 'a']].forEach(([id, p1, p2]) => { sk.ents[id] = { id, t: 'line', p1, p2 }; });
    const sk2 = R.newSketchData(); sk2.pts.o = { id: 'o', x: 0, y: 0 }; sk2.ents.K = { id: 'K', t: 'circle', c: 'o', r: 5 };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 20, dir: 1 },
      { id: 'f3', type: 'sketch', name: 'Эскиз2', plane: R.PLANES.top, sk: sk2 }, { id: 'f4', type: 'extrude', name: 'Вырез1', sketch: 'f3', mode: 'cut', end: 'face', depth: 5, dir: 1 }] });
    R.rebuild(); R.editFeature(R.featById('f4')); R.S.pm.pickTarget = true; R.look([1, 0.4, 0.3], [0, 1, 0]); });
  await p.waitForTimeout(600); const box = await (await p.$('#cv')).boundingBox();
  const at = async (w) => { const s = await p.evaluate((w) => { const R = window.__rezets; return R.toScreen(new (R.toWorld(R.PLANES.top, 0, 0).constructor)(...w)); }, w); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(300); };
  await at([20, 10, 5]); const side = await p.evaluate(() => ({ target: window.__rezets.featById('f4').target?.n || window.__rezets.S.pm?.feature?.target?.n || null, toast: [...document.querySelectorAll('.toast')].map((e) => e.textContent).join(' | ') }));
  await at([5, 20, -5]); const top = await p.evaluate(() => (window.__rezets.S.pm?.feature?.target?.n || []).map((v) => Math.round(v)));
  console.log(JSON.stringify({ side, top })); console.log('expect side.target null with a toast about a face along the extrusion; top [0,1,0]');
  console.log(logs.join('\n')); await b.close(); })();

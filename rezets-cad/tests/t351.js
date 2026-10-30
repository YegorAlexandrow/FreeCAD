// J29: two lines that do not meet are filleted where they would cross: the nearer ends are brought to the corner
// first. S0-16: a construction diagonal through a corner does not stop a fillet there.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; };
    P('a', 0, 0); P('b', 10, 0); P('c', 15, 3); P('d', 15, 20); sk.ents.A = { id: 'A', t: 'line', p1: 'a', p2: 'b' }; sk.ents.B = { id: 'B', t: 'line', p1: 'c', p2: 'd' };
    P('e', 30, 0); P('f', 50, 0); P('g', 50, 20); sk.ents.E = { id: 'E', t: 'line', p1: 'e', p2: 'f' }; sk.ents.F = { id: 'F', t: 'line', p1: 'f', p2: 'g' }; sk.ents.G = { id: 'G', t: 'line', p1: 'f', p2: 'e2', constr: true }; P('e2', 35, 15); sk.nid = 100;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); R.setTool('sfillet'); R.S.toolOpt.filletR = 1; });
  await p.waitForTimeout(400); const box = await (await p.$('#cv')).boundingBox();
  const at = async (u, v) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(200); };
  await at(5, 0); await at(15, 12); await at(50, 0);
  console.log(JSON.stringify(await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; const P = (id) => [+sk.pts[id].x.toFixed(3), +sk.pts[id].y.toFixed(3)];
    const arcs = Object.values(sk.ents).filter((e) => e.t === 'arc'); return { arcs: arcs.length, A: [P(sk.ents.A.p1), P(sk.ents.A.p2)], B: [P(sk.ents.B.p1), P(sk.ents.B.p2)], toast: [...document.querySelectorAll('.toast')].map((e) => e.textContent).join(' | ') }; })));
  console.log('expect arcs 2; A from [0,0] to [14,0]; B from [15,1] to [15,20]; no warning');
  console.log(logs.join('\n')); await b.close(); })();

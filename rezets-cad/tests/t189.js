// C19: in the Fillet tool a click on one line and then on the line it meets rounds their corner;
// two lines that do not meet give a warning instead of nothing.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(0, 0), P(40, 0), P(40, 20), P(0, 20)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); R.setTool('sfillet'); });
  await p.waitForTimeout(400); const box = await (await p.$('#cv')).boundingBox();
  const at = async (u, v) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(200); };
  const arcs = () => p.evaluate(() => Object.values(window.__rezets.featById('f1').sk.ents).filter((e) => e.t === 'arc').length);
  await at(20, 0); const hint = await p.evaluate(() => document.querySelector('#hint')?.textContent || ''); await at(40, 10); const a1 = await arcs();
  await at(20, 20); await at(20, 0.5); const a2 = await arcs(); const toast = await p.evaluate(() => [...document.querySelectorAll('.toast')].map((e) => e.textContent).join(' | '));
  console.log(JSON.stringify({ hint, a1, a2, toast }));
  console.log('expect hint about the second line; a1 1; a2 1 (top and bottom do not meet) with a warning toast');
  console.log(logs.join('\n')); await b.close(); })();

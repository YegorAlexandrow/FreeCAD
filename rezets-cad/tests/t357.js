// S0-35: lone points (hole centres) picked with the rest are copied by a sketch pattern and mirrored by the mirror,
// and stay hole centres. S0-37: the centre of a circular pattern is clicked in the open pattern (it had to be
// picked before starting it).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; };
    P('o', 5, 0); sk.ents.C = { id: 'C', t: 'circle', c: 'o', r: 1 }; P('h', 5, 5); sk.pts.h.hole = true; sk.pts.h.free = true; P('z', 20, 20); sk.pts.z.hole = true; sk.pts.z.free = true; sk.nid = 100;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1'));
    R.S.sel = new Set(['e:C', 'p:h']); R.cmdSkPattern(); R.S.skOp.opt.n = 3; R.S.skOp.opt.dx = 10; R.okPattern();
    R.S.sel = new Set(['p:h', 'e:V']); R.cmdMirror(); R.okMirror(); });
  const r1 = await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; return Object.values(sk.pts).filter((q) => q.hole).map((q) => [+q.x.toFixed(2), +q.y.toFixed(2)]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); });
  await p.evaluate(() => { const R = window.__rezets; R.S.sel = new Set(['e:C']); R.cmdSkPattern(); R.S.skOp.opt.kind = 'circ'; R.renderSide(); });
  await p.waitForTimeout(300); await p.locator('#side .pickbox', { hasText: 'Центр' }).click(); await p.waitForTimeout(100);
  const box = await (await p.$('#cv')).boundingBox(); const s = await p.evaluate(() => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, 20, 20)); });
  await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(200); const c = await p.evaluate(() => window.__rezets.S.skOp?.opt.c);
  console.log(JSON.stringify({ holes: r1, centre: c })); console.log('expect holes [-5,5],[5,5],[15,5],[20,20],[25,5]; centre z');
  console.log(logs.join('\n')); await b.close(); })();

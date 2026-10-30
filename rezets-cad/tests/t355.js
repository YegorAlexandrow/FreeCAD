// S0-36: the sketch mirror shows which line it mirrors about and what, and either can be changed by a click before
// anything is made: the longest construction line was guessed as the axis with no way to say otherwise.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; };
    P('a', 2, 2); P('b', 8, 2); P('c', 8, 6); sk.ents.A = { id: 'A', t: 'line', p1: 'a', p2: 'b' }; sk.ents.B = { id: 'B', t: 'line', p1: 'b', p2: 'c' };
    P('u1', 10, -20); P('u2', 10, 20); sk.ents.L = { id: 'L', t: 'line', p1: 'u1', p2: 'u2', constr: true }; P('w1', -20, 0); P('w2', 30, 0); sk.ents.W = { id: 'W', t: 'line', p1: 'w1', p2: 'w2', constr: true }; sk.nid = 100;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1'));
    R.S.sel = new Set(['e:A', 'e:B', 'e:L', 'e:W']); R.cmdMirror(); });
  await p.waitForTimeout(300); const box = await (await p.$('#cv')).boundingBox();
  const before = await p.evaluate(() => ({ axis: window.__rezets.S.skOp?.axis, ids: window.__rezets.S.skOp?.ids, made: Object.keys(window.__rezets.featById('f1').sk.ents).length }));
  await p.locator('#side .pickbox', { hasText: 'Относительно' }).click();
  const s = await p.evaluate(() => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, 10, 12)); }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(200);
  await p.locator('#side .chip', { hasText: 'OK' }).click(); await p.waitForTimeout(300);
  const after = await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; return { n: Object.keys(sk.ents).length, xs: Object.values(sk.pts).map((q) => +q.x.toFixed(2)).filter((x) => x > 11).sort((a, b) => a - b) }; });
  console.log(JSON.stringify({ before, after })); console.log('expect before axis W (the longest), ids A,B,L, made 4; after mirroring A,B about L only: n 6, xs [12,12,18,30] (30 is the end of W, which is not mirrored)');
  console.log(logs.join('\n')); await b.close(); })();

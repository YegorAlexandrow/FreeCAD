// S0-22: a line drawn to where two lines cross ends on both of them; one drawn to the top of a circle ends on it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(0, 0), c = P(40, 40), d = P(0, 30), e = P(40, 0); sk.ents.l1 = { id: 'l1', t: 'line', p1: a, p2: c }; sk.ents.l2 = { id: 'l2', t: 'line', p1: d, p2: e }; sk.ents.c = { id: 'c', t: 'circle', c: P(80, 20), r: 10 };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); R.setTool('line'); });
  await p.waitForTimeout(300); const box = await (await p.$('#cv')).boundingBox(); const scr = (u, v) => p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]);
  const go = async (u, v) => { const s = await scr(u, v); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 4 }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(100); };
  await go(20.4, -15); await go(17.3, 17.0); await go(80.3, 30.4); await p.keyboard.press('Escape');
  console.log(JSON.stringify(await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; const pts = Object.values(sk.pts).map((q) => [+q.x.toFixed(2), +q.y.toFixed(2)]); return { pts, rel: Object.values(sk.cons).map((c) => c.t) }; })));
  console.log('expect points (17.14,17.14) and (80,30) among pts; rel with online×2 and oncircle');
  console.log(logs.join('\n')); await b.close(); })();

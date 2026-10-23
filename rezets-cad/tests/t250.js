// S0-20: with Ctrl held, a line ends right next to an existing point instead of snapping onto it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(20, 0), c = P(20, 20); sk.ents.l = { id: 'l', t: 'line', p1: a, p2: c };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); R.setTool('line'); });
  await p.waitForTimeout(300); const box = await (await p.$('#cv')).boundingBox(); const scr = (u, v) => p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]);
  const go = async (u, v) => { const s = await scr(u, v); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 4 }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(100); };
  await go(-10, 3); await p.keyboard.down('Control'); await go(19.6, 19.7); await p.keyboard.up('Control'); await p.keyboard.press('Escape');
  console.log(JSON.stringify(await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; const l = Object.values(sk.ents).find((e) => e.id !== 'l'); const q = sk.pts[l.p2]; return { end: [+q.x.toFixed(1), +q.y.toFixed(1)], coinc: Object.values(sk.cons).filter((c) => c.t === 'coincident').length }; })));
  console.log('expect end about [19.6, 19.7], coinc 0');
  console.log(logs.join('\n')); await b.close(); })();

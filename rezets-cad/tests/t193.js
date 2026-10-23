// C27: G with nothing selected makes the figure just drawn construction geometry (the whole line chain).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(-30, -30), c = P(-10, -30); sk.ents.l0 = { id: 'l0', t: 'line', p1: a, p2: c };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); R.setTool('line'); });
  await p.waitForTimeout(400); const box = await (await p.$('#cv')).boundingBox();
  const at = async (u, v) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(150); };
  await at(0, 0); await at(20, 3); await at(25, 20); await p.keyboard.press('Escape'); await p.keyboard.press('Escape'); await p.keyboard.press('g'); await p.waitForTimeout(200);
  console.log(JSON.stringify(await p.evaluate(() => Object.values(window.__rezets.featById('f1').sk.ents).map((e) => [e.id, !!e.constr]))));
  console.log('expect l0 false, the two new lines true');
  console.log(logs.join('\n')); await b.close(); })();

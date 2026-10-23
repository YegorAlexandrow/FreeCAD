// S0-10/S0-11: a box drawn left to right takes only what is wholly inside (an arc by its own run, not its circle);
// drawn right to left it also takes what it crosses.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(0, 0), c = P(10, 0); sk.ents.inner = { id: 'inner', t: 'line', p1: a, p2: c }; const d = P(-5, 20), e = P(40, 20); sk.ents.long = { id: 'long', t: 'line', p1: d, p2: e };
    const cc = P(5, -10), a1 = P(15, -10), a2 = P(5, 0); sk.ents.arc = { id: 'arc', t: 'arc', c: cc, p1: a1, p2: a2, r: 10 };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); });
  await p.waitForTimeout(300); const box = await (await p.$('#cv')).boundingBox(); const scr = (u, v) => p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]);
  const drag = async (u0, v0, u1, v1) => { const a = await scr(u0, v0), c = await scr(u1, v1); await p.mouse.move(box.x + a.x, box.y + a.y); await p.mouse.down(); await p.mouse.move(box.x + c.x, box.y + c.y, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(150); return p.evaluate(() => [...window.__rezets.S.sel].filter((k) => k.startsWith('e:')).sort()); };
  const win = await drag(-2, 25, 17, -12); await p.keyboard.press('Escape'); const cross = await drag(17, 25, -2, -12);
  console.log(JSON.stringify({ win, cross })); console.log('expect win [e:arc, e:inner] (the arc lies inside though its circle does not), cross also e:long');
  console.log(logs.join('\n')); await b.close(); })();

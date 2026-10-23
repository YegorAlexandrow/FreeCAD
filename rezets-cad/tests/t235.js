// J11: a circle with its diameter set is moved by dragging its rim; a free one is resized as before.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const run = (withDim) => p.evaluate(async (withDim) => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const c = P(0, 0); sk.ents.c = { id: 'c', t: 'circle', c, r: 10 }; if (withDim) sk.cons.d = { id: 'd', t: 'diam', refs: ['c'], v: 20 };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); return 0; }, withDim);
  const box = await (await p.$('#cv')).boundingBox(); const scr = (u, v) => p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]);
  const drag = async () => { const a = await scr(10, 0), b2 = await scr(15, 5); await p.mouse.move(box.x + a.x, box.y + a.y); await p.mouse.down(); await p.mouse.move(box.x + b2.x, box.y + b2.y, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(200);
    return p.evaluate(() => { const k = window.__rezets.featById('f1').sk; const c = k.pts[k.ents.c.c]; return { c: [+c.x.toFixed(1), +c.y.toFixed(1)], r: +k.ents.c.r.toFixed(2) }; }); };
  await run(true); await p.waitForTimeout(300); const fixed = await drag(); await run(false); await p.waitForTimeout(300); const free = await drag();
  console.log(JSON.stringify({ fixed, free })); console.log('expect fixed: centre moved by about (5,5), r 10; free: centre (0,0), r about 15.8');
  console.log(logs.join('\n')); await b.close(); })();

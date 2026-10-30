// S0-38: Ctrl+A selects everything in the sketch, Ctrl+C copies what is selected with the relations among it, Ctrl+V
// pastes it where the cursor is; the copy is ordinary geometry, apart from the original.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; };
    P('a', 0, 0); P('b', 10, 0); P('o', 5, 5); sk.ents.A = { id: 'A', t: 'line', p1: 'a', p2: 'b' }; sk.ents.C = { id: 'C', t: 'circle', c: 'o', r: 2 };
    sk.cons.h = { id: 'h', t: 'horizontal', refs: ['A'] }; sk.cons.d = { id: 'd', t: 'diam', refs: ['C'], v: 4, pos: [8, 8] }; sk.nid = 100;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); });
  await p.waitForTimeout(400); const box = await (await p.$('#cv')).boundingBox();
  const s = await p.evaluate(() => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, 25, 15)); });
  await p.mouse.move(box.x + s.x, box.y + s.y); await p.keyboard.press('Control+a'); const sel = await p.evaluate(() => window.__rezets.S.sel.size);
  await p.keyboard.press('Control+c'); await p.mouse.move(box.x + s.x + 1, box.y + s.y); await p.keyboard.press('Control+v'); await p.waitForTimeout(300);
  console.log(JSON.stringify({ sel, ...(await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; const cs = Object.values(sk.cons);
    const C2 = Object.values(sk.ents).find((e) => e.t === 'circle' && e.id !== 'C'); const c = C2 && sk.pts[C2.c];
    return { ents: Object.keys(sk.ents).length, h: cs.filter((k) => k.t === 'horizontal').length, diam: cs.filter((k) => k.t === 'diam').length, centre: c && [Math.round(c.x), Math.round(c.y)] }; })) }));
  console.log('expect sel 2, ents 4, h 2, diam 2, centre [25,18] (the middle of the copied points put on the cursor at [25,15])');
  console.log(logs.join('\n')); await b.close(); })();

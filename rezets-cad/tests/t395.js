// S0-25: with a line selected, H adds the relation and Shift+C picks the circle tool instead of adding a coincidence.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); const L = (...a) => console.log(...a);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [] }); R.startSketch({ ...R.PLANES.front }); const sk = S.doc.features.find((f) => f.id === S.editing).sk;
    sk.pts.a = { id: 'a', x: 0, y: 0 }; sk.pts.b = { id: 'b', x: 30, y: 4 }; sk.ents.l = { id: 'l', t: 'line', p1: 'a', p2: 'b' }; R.setTool('select'); S.sel = new Set(['e:l']); R.commitSketch(); });
  await p.mouse.move(300, 300); await p.keyboard.press('h'); await p.waitForTimeout(200);
  L('after H', await p.evaluate(() => { const S = window.__rezets.S; const sk = S.doc.features.find((f) => f.id === S.editing).sk; return Object.values(sk.cons).map((c) => c.t).join(','); }));
  await p.evaluate(() => { window.__rezets.S.sel = new Set(['p:a', 'p:b']); });
  await p.keyboard.press('Shift+C'); await p.waitForTimeout(200);
  L('after Shift+C', await p.evaluate(() => { const S = window.__rezets.S; const sk = S.doc.features.find((f) => f.id === S.editing).sk; return S.tool + ' cons ' + Object.values(sk.cons).map((c) => c.t).join(','); }));
  L(logs.join('\n')); await b.close(); })();

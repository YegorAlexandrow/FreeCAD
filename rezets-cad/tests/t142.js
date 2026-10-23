// Sketch pattern of a circle: the preview works (it threw on every key), typing the count and clicking OK makes the
// pattern on the first click.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1500); const out = {};
  out.preview = await p.evaluate(() => { const R = window.__rezets; const S = R.S; R.startSketch({ ...R.PLANES.front }); const sk = R.featById(S.editing).sk; sk.pts.c = { id: 'c', x: 0, y: 0 }; sk.ents.k = { id: 'k', t: 'circle', c: 'c', r: 3 }; R.commitSketch();
    S.sel.clear(); S.sel.add('e:k'); R.cmdSkPattern(); return S.draw?.preview?.length || 0; });
  const grp = p.locator('#side .grp', { has: p.locator('button', { hasText: 'OK' }) }); await grp.locator('label.field', { hasText: 'Количество' }).locator('input').fill('5');
  out.typed = await p.evaluate(() => window.__rezets.S.draw?.preview?.length || 0);
  await grp.locator('button', { hasText: 'OK' }).click(); await p.waitForTimeout(300);
  out.made = await p.evaluate(() => { const sk = window.__rezets.featById(window.__rezets.S.editing).sk; return { pats: Object.keys(sk.pats || {}).length, circles: Object.values(sk.ents).filter((e) => e.t === 'circle').length }; });
  console.log(JSON.stringify(out)); console.log('expect preview 96 (2 copies x 48 segments), typed 192, made pats 1 circles 5, no page errors');
  console.log(logs.join('\n')); await b.close(); })();

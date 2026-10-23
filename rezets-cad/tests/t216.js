// C10: «Показать, что не определено» keeps the Dimension tool on and marks the free geometry.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(0, 0), c = P(40, 10); sk.ents.l0 = { id: 'l0', t: 'line', p1: a, p2: c };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); R.setTool('dim');
    [...document.querySelectorAll('#side .chip')].find((e) => e.textContent.includes('не определено')).click(); return { tool: S.tool, sel: [...S.sel] }; })));
  console.log('expect tool dim, sel [e:l0]');
  console.log(logs.join('\n')); await b.close(); })();

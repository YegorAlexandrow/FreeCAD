// C16: the red marking of a conflict goes away on a click into empty space, on another tool, or when a relation goes in.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const st = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(0, 0), c = P(40, 0), d = P(0, 20), e = P(40, 25); sk.ents.l0 = { id: 'l0', t: 'line', p1: a, p2: c }; sk.ents.l1 = { id: 'l1', t: 'line', p1: d, p2: e };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); const k = R.featById('f1').sk;
    R.tryAddConstraint(k, { id: 'h', t: 'horizontal', refs: ['l0'] }); R.tryAddConstraint(k, { id: 'pp', t: 'perpendicular', refs: ['l0', 'l1'] });
    S.sel = new Set(['e:l1']); R.applyRelation(R.relationOptions(k).find((o) => o[0] === 'horizontal')[2]); const n0 = S.conflict.size;
    R.setTool('line'); const n1 = S.conflict.size; R.setTool('select');
    S.sel = new Set(['e:l1']); R.applyRelation(R.relationOptions(k).find((o) => o[0] === 'horizontal')[2]); const n2 = S.conflict.size; return { n0, n1, n2 }; });
  const box = await (await p.$('#cv')).boundingBox(); await p.mouse.click(box.x + 60, box.y + 60); await p.waitForTimeout(200);
  console.log(JSON.stringify({ ...st, afterClick: await p.evaluate(() => window.__rezets.S.conflict.size) }));
  console.log('expect n0 > 0, n1 0, n2 > 0, afterClick 0');
  console.log(logs.join('\n')); await b.close(); })();

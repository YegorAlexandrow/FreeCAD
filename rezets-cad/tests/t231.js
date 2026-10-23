// J20/J21: an ellipse whose axis end is put on an existing point, and a polygon whose vertex is, stay on that point.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const setup = (tool) => p.evaluate((tool) => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(30, 0), c = P(40, 20); sk.ents.l = { id: 'l', t: 'line', p1: a, p2: c };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); R.setTool(tool); }, tool);
  const box = await (await p.$('#cv')).boundingBox();
  const at = async (u, v) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(150); };
  const check = () => p.evaluate(() => { const R = window.__rezets; const sk = R.featById('f1').sk; return { tied: Object.values(sk.cons).filter((c) => c.t === 'coincident' && c.refs.includes(sk.ents.l.p1)).length }; });
  await setup('ellipse'); await p.waitForTimeout(300); await at(0, 0); await at(30, 0); await at(10, 8); const ell = await check();
  await setup('polygon'); await p.waitForTimeout(300); await at(0, 0); await at(30, 0); const poly = await check();
  console.log(JSON.stringify({ ell, poly })); console.log('expect tied 1 each (a coincidence with the end of the line)');
  console.log(logs.join('\n')); await b.close(); })();

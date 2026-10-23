// S0-23/S0-42/S0-44: the Point tool on an existing point adds no second one; a double click in a line chain makes no
// sliver of a line; the sketch corner has a button to leave without keeping the changes.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const a = P(0, 0), c = P(30, 0); sk.ents.l = { id: 'l', t: 'line', p1: a, p2: c };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1')); R.setTool('point'); });
  await p.waitForTimeout(300); const box = await (await p.$('#cv')).boundingBox();
  const scr = (u, v) => p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]);
  const at = async (u, v, dbl) => { const s = await scr(u, v); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); if (dbl) await p.mouse.dblclick(box.x + s.x, box.y + s.y); else await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(150); };
  const n = () => p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; return [Object.keys(sk.pts).length, Object.values(sk.ents).filter((e) => e.t === 'line').length]; });
  const n0 = await n(); await at(30, 0); const n1 = await n();
  await p.evaluate(() => window.__rezets.setTool('line')); await at(0, 20); await at(20, 25); await at(20, 40, true); const n2 = await n();
  const lens = await p.evaluate(() => { const sk = window.__rezets.featById('f1').sk; return Object.values(sk.ents).filter((e) => e.t === 'line').map((e) => +Math.hypot(sk.pts[e.p2].x - sk.pts[e.p1].x, sk.pts[e.p2].y - sk.pts[e.p1].y).toFixed(2)); });
  const corner = await p.$$eval('#corner button', (e) => e.map((x) => x.title));
  console.log(JSON.stringify({ n0, n1, lens, corner })); console.log('expect n1 = n0; lens without anything under 1; corner has «Выйти без сохранения изменений»');
  console.log(logs.join('\n')); await b.close(); })();

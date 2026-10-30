// J19: a chain of lines closed on its first point: the closing line is vertical as well as joined there (the snap to
// the point used to drop the vertical), so the rectangle drawn by hand is fully held by its relations.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk: R.newSketchData() }] }); R.editFeature(R.featById('f1')); R.setTool('line'); });
  await p.waitForTimeout(400); const box = await (await p.$('#cv')).boundingBox();
  const at = async (u, v) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; return R.toScreen(R.toWorld(R.featById('f1').plane, u, v)); }, [u, v]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(150); };
  await at(5, 5); await at(25, 5); await at(25, 15); await at(5, 15); await at(5, 5); await p.keyboard.press('Escape');
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const sk = R.featById('f1').sk;
    const last = Object.values(sk.ents).at(-1); const rel = (e) => Object.values(sk.cons).filter((c) => c.refs.includes(e.id) && (c.t === 'horizontal' || c.t === 'vertical')).map((c) => c.t);
    return { lines: Object.values(sk.ents).length, closing: rel(last), all: Object.values(sk.ents).map(rel).map((x) => x.join()).join('|') }; })));
  console.log('expect lines 4, closing [vertical], all horizontal|vertical|horizontal|vertical');
  console.log(logs.join('\n')); await b.close(); })();

const open = require('./harness.js');
const vol = () => { const S = window.__rezets.S; if (!S.body) return 0; const pos = S.body.getAttribute('position'); let v = 0; for (let i = 0; i < pos.count; i += 3) { const a = [pos.getX(i), pos.getY(i), pos.getZ(i)], b = [pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1)], c = [pos.getX(i + 2), pos.getY(i + 2), pos.getZ(i + 2)]; v += a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]); } return v / 6; };
(async () => {
  let { b, p, logs } = await open();
  // half revolve via data edit, through the same rebuild path
  const r = await p.evaluate((volSrc) => {
    const vol = eval('(' + volSrc + ')'); const R = window.__rezets; const out = {};
    const doc = { name: 't', features: [], rollback: null, nid: 10 };
    const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; };
    const a = P(10, 0), b = P(30, 0), c = P(30, 40), d = P(10, 40); for (const [u, v] of [[a, b], [b, c], [c, d], [d, a]]) { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: v }; }
    doc.features.push({ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk });
    doc.features.push({ id: 'f2', type: 'revolve', name: 'Поворот1', sketch: 'f1', mode: 'add', angle: 180, dir: 1, axis: 'V', regions: null });
    R.loadDoc(doc); out.half = vol(); out.halfExact = Math.PI * (900 - 100) * 40 / 2;
    // revolve cut: a groove
    const sk2 = R.newSketchData(); const Q = (x, y) => { const id = String(sk2.nid++); sk2.pts[id] = { id, x, y }; return id; };
    const e = Q(26, 15), f = Q(35, 15), g = Q(35, 25), hh = Q(26, 25); for (const [u, v] of [[e, f], [f, g], [g, hh], [hh, e]]) { const id = String(sk2.nid++); sk2.ents[id] = { id, t: 'line', p1: u, p2: v }; }
    doc.features[1].angle = 360;
    doc.features.push({ id: 'f3', type: 'sketch', name: 'Эскиз2', plane: R.PLANES.front, sk: sk2 });
    doc.features.push({ id: 'f4', type: 'revolve', name: 'Канавка', sketch: 'f3', mode: 'cut', angle: 360, dir: 1, axis: 'V', regions: null });
    R.loadDoc(doc); out.groove = vol(); out.grooveExact = Math.PI * (900 - 100) * 40 - Math.PI * (900 - 676) * 10; out.err = R.S.errors;
    return out;
  }, vol.toString());
  console.log(JSON.stringify(r));
  // sample: edit Эскиз1 dimension 120 -> 140 via dblclick in tree, then exit, check body width
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800);
  await p.locator('.row', { hasText: 'Эскиз1' }).dblclick(); await p.waitForTimeout(600);
  await p.locator('.dimlbl', { hasText: '120' }).dblclick(); await p.waitForTimeout(200);
  await p.fill('#dimInput', '140'); await p.press('#dimInput', 'Enter'); await p.waitForTimeout(300);
  await p.screenshot({ path: 'shot6.png' });
  await p.click('#corner .ok'); await p.waitForTimeout(1000);
  const bb = await p.evaluate(() => { const S = window.__rezets.S; S.body.computeBoundingBox(); return [S.body.boundingBox.min.x, S.body.boundingBox.max.x, Object.keys(S.errors)]; });
  console.log('width after edit', bb);
  await p.keyboard.press('Control+z'); await p.waitForTimeout(800);
  // Undo comes back into the sketch, where the model is rolled back to it: the width is read off the whole tree.
  const bb2 = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const g = R.computeBody(S.doc.features).body; g.computeBoundingBox(); return [g.boundingBox.min.x, g.boundingBox.max.x, !!S.editing]; });
  console.log('after undo', bb2);
  console.log(logs.join('\n')); await b.close();
  // dark theme + phone
  ({ b, p, logs } = await open({ dark: true }));
  await p.screenshot({ path: 'shot7_dark.png' });
  await p.locator('.row', { hasText: 'Эскиз2' }).dblclick(); await p.waitForTimeout(700); await p.screenshot({ path: 'shot8_dark_sketch.png' });
  await b.close();
  ({ b, p, logs } = await open({ viewport: { width: 390, height: 780 } }));
  await p.screenshot({ path: 'shot9_phone.png' });
  const ov = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  console.log('phone overflow', ov, logs.join('\n')); await b.close();
})();

// Shell: open box and closed cavity against exact volumes, then the sample part.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  const r = await p.evaluate(() => {
    const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; };
    const a = P(-50, -30), bb = P(50, -30), c = P(50, 30), d = P(-50, 30); for (const [u, v] of [[a, bb], [bb, c], [c, d], [d, a]]) { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: v }; }
    const doc = { name: 'Коробка', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 15, dir: 1, regions: null }] };
    R.loadDoc(doc); const out = { box: R.geoVolume(R.S.body) };
    const t0 = performance.now();
    doc.features.push({ id: 'f3', type: 'shell', name: 'Оболочка1', t: 2, faces: [{ n: [0, 1, 0], d: 15 }] }); R.rebuild(); out.open = R.geoVolume(R.S.body); out.ms = Math.round(performance.now() - t0); out.err = R.S.errors;
    doc.features[2].faces = []; R.rebuild(); out.closed = R.geoVolume(R.S.body);
    doc.features[2].faces = [{ n: [0, 1, 0], d: 15 }, { n: [1, 0, 0], d: 50 }]; R.rebuild(); out.two = R.geoVolume(R.S.body);
    doc.features[2].t = 40; R.rebuild(); out.tooThick = R.S.errors.f3;
    doc.features[2].t = 2; R.rebuild();
    return out;
  });
  L('box', r.box.toFixed(3), 'open top', r.open.toFixed(3), 'exact', 90000 - 96 * 56 * 13, 'ms', r.ms, JSON.stringify(r.err));
  L('closed', r.closed.toFixed(3), 'exact', 90000 - 96 * 56 * 11);
  L('top+side open', r.two.toFixed(3), 'exact', 90000 - 98 * 56 * 13);
  L('too thick ->', r.tooThick);
  await p.click('[data-view="iso"]'); await p.waitForTimeout(600); await p.screenshot({ path: 's34_box.png' });
  // UI: sample part, shell removing the bottom face, picked by clicking
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Пример детали' }).click(); await p.waitForTimeout(800);
  await p.click('button.tool:has-text("Оболочка")'); await p.waitForTimeout(300);
  await p.fill('#pmThick', '2'); await p.press('#pmThick', 'Tab'); await p.waitForTimeout(1500);
  L('sample closed shell', await p.evaluate(() => { const R = window.__rezets; return [R.geoVolume(R.S.body).toFixed(1), JSON.stringify(R.S.errors)]; }));
  await p.keyboard.press('Enter'); await p.waitForTimeout(1000);
  await p.click('[data-view="iso"]'); await p.waitForTimeout(600); await p.screenshot({ path: 's34_sample.png' });
  L(logs.join('\n')); await b.close();
})();

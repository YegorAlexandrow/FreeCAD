// Drawing of the sample part: views, hidden lines, scale, dimensions.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open({ viewport: { width: 1500, height: 1000 } });
  const L = (...a) => console.log(...a);
  const t0 = Date.now();
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Новый чертёж' }).click(); await p.waitForTimeout(1500);
  L('ms', Date.now() - t0, await p.evaluate(() => { const R = window.__rezets; const Lr = R.layoutDrawing(R.S.doc); return JSON.stringify({ scale: Lr.scale, views: Object.fromEntries(Object.entries(Lr.views).map(([k, v]) => [k, { vis: v.vis.length, hid: v.hid.length, circ: v.circles.length, w: +(v.box.umax - v.box.umin).toFixed(2), h: +(v.box.vmax - v.box.vmin).toFixed(2) }])), pos: Object.keys(Lr.pos) }); }));
  await p.screenshot({ path: 's45_sheet.png' });
  // user dimension: two vertices in the front view
  await p.keyboard.press('d');
  const pts = await p.evaluate(() => { const R = window.__rezets; const Lr = R.layoutDrawing(R.S.doc); const v = Lr.views.front; const vs = v.verts.filter((q) => !q.hidden); vs.sort((a, b) => a.u - b.u || a.v - b.v); const svg = document.querySelector('#drawing svg'); const m = svg.getScreenCTM(); const toScr = (w) => { const k = 'front'; const pp = { x: Lr.pos[k].x + (w[0] * v.R[0] + w[1] * v.R[1] + w[2] * v.R[2] - v.box.umin) * Lr.scale, y: Lr.pos[k].y + (v.box.vmax - (w[0] * v.U[0] + w[1] * v.U[1] + w[2] * v.U[2])) * Lr.scale }; const pt = svg.createSVGPoint(); pt.x = pp.x; pt.y = pp.y; const s = pt.matrixTransform(m); return [s.x, s.y]; }; return { a: toScr(vs[0].w), b: toScr(vs[vs.length - 1].w), aw: vs[0].w, bw: vs[vs.length - 1].w }; });
  await p.mouse.click(...pts.a); await p.mouse.click(...pts.b); await p.mouse.click((pts.a[0] + pts.b[0]) / 2, Math.max(pts.a[1], pts.b[1]) + 40); await p.waitForTimeout(400);
  L('user dim', await p.evaluate(() => JSON.stringify(window.__rezets.S.doc.dims)), JSON.stringify(pts.aw), JSON.stringify(pts.bw));
  await p.screenshot({ path: 's45_dim.png' });
  const svgLen = await p.evaluate(() => document.querySelector('#drawing svg').outerHTML.length); L('svg bytes', svgLen);
  // the drawing follows the model: edit the plate depth via the part and come back
  await p.locator('.doctab', { hasText: 'Кронштейн' }).first().click(); await p.waitForTimeout(500);
  await p.evaluate(() => { const R = window.__rezets; const f = R.S.doc.features.find((x) => x.name === 'Бобышка2'); f.depth = 28; R.rebuild(); });
  await p.locator('.doctab', { hasText: 'чертёж' }).click(); await p.waitForTimeout(1200);
  L('after model edit', await p.evaluate(() => { const R = window.__rezets; const Lr = R.layoutDrawing(R.S.doc); return (Lr.views.front.box.vmax - Lr.views.front.box.vmin).toFixed(2); }), 'expect front height 40');
  L(logs.join('\n')); await b.close();
})();

const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const box = await (await p.$('#cv')).boundingBox();
  const W = (x, y, z) => p.evaluate(([x, y, z]) => { const R = window.__rezets; return R.toScreen(R.toWorld({ o: [x, y, z], x: [1, 0, 0], y: [0, 1, 0] }, 0, 0)); }, [x, y, z]);
  const clickAt = async (s) => { await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 3 }); await p.waitForTimeout(80); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(120); };
  const clickUV = async (u, v) => clickAt(await p.evaluate(([u, v]) => { const R = window.__rezets; const f = R.featById(R.S.editing); return R.toScreen(R.toWorld(f.plane, u, v)); }, [u, v]));
  const st = () => p.evaluate(() => { const R = window.__rezets; const f = R.S.editing && R.featById(R.S.editing); const a = R.S.analysis; return { dof: a?.dof, cons: f ? Object.values(f.sk.cons).map(c => c.t + (c.driven ? '(d)' : '') + (c.v != null ? '=' + Math.round(c.v * 1000) / 1000 : '')) : null, ext: f ? Object.values(f.sk.ents).filter(e => e.ext).length : 0 }; });
  // front face of the plate: z = 40 (top plane sketch y=-Z, plate 80 deep)
  await p.click('[data-view="front"]'); await p.waitForTimeout(700);
  await clickAt(await W(-30, 6, 40)); await p.keyboard.press('s'); await p.waitForTimeout(600);
  const plane = await p.evaluate(() => { const R = window.__rezets; return R.featById(R.S.editing).plane; });
  const refs = await p.evaluate(() => { const r = window.__rezets.S.refs; return { lines: r.lines.length, circles: r.circles.length, verts: r.verts.length }; });
  console.log('plane', JSON.stringify(plane), 'refs', JSON.stringify(refs));
  // circle at (-30,6) r~3
  await p.keyboard.press('c'); await clickUV(-30, 6); await clickUV(-27, 6);
  // diameter
  await p.keyboard.press('d'); await clickUV(-27, 6); await clickUV(-20, 14); await p.waitForSelector('#dimInput'); await p.keyboard.type('5'); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
  // distance from centre to the bottom edge of the face (model edge at y=0), placed to the left
  await clickUV(-30, 6); await clickUV(-50, 0); await clickUV(-45, 3); await p.waitForSelector('#dimInput'); await p.keyboard.type('8'); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
  // distance from centre to the left edge of the face (x=-60)
  await clickUV(-30, 6); await clickUV(-60, 6); await clickUV(-45, 16); await p.waitForSelector('#dimInput'); await p.keyboard.type('25'); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
  const s1 = await st(); console.log('sketch', JSON.stringify(s1));
  const ctr = await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; const c = Object.values(sk.ents).find(e => e.t === 'circle' && !e.ext); return [sk.pts[c.c].x, sk.pts[c.c].y, c.r]; });
  console.log('circle centre/r', ctr);
  await p.screenshot({ path: 'shot10.png' });
  // RU layout Ctrl+Z: key 'я', code KeyZ
  const before = await st();
  await p.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'я', code: 'KeyZ', ctrlKey: true, bubbles: true })));
  await p.waitForTimeout(300); const afterRu = await st();
  await p.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'н', code: 'KeyY', ctrlKey: true, bubbles: true })));
  await p.waitForTimeout(300); const afterRedo = await st();
  console.log('ru undo cons', before.cons.length, '->', afterRu.cons.length, '-> redo', afterRedo.cons.length);
  // exit, cut through
  await p.click('#corner .ok'); await p.waitForTimeout(400);
  const t0 = Date.now(); await p.keyboard.press('x'); await p.waitForTimeout(300); await p.click('#corner .ok'); await p.waitForTimeout(300);
  console.log('cut took ms ~', Date.now() - t0, JSON.stringify(await p.evaluate(() => window.__rezets.S.errors)));
  // measure: hole diameter and plate thickness
  await p.keyboard.press('m'); await p.click('[data-view="iso"]'); await p.waitForTimeout(700);
  const res = await p.evaluate(() => { const R = window.__rezets; const T = R.bodyTopo(); const c = T.circles.find(c => Math.abs(c.r - 2.5) < 0.01); const faces = []; return { circles: T.circles.map(c => +(2 * c.r).toFixed(3)).sort((a, b) => a - b), d: c ? R.measureResult({ kind: 'circle', c: c.c, r: c.r, n: c.n, p: c.c }).main : null }; });
  console.log('measure', JSON.stringify(res));
  // click top face then bottom-ish: top face of plate at (50,12,-30), front face z=40; use face picks via clicks
  const hole = await p.evaluate(() => { const R = window.__rezets; const c = R.bodyTopo().circles.find(c => Math.abs(c.r - 2.5) < 1e-6); return [c.c.x + c.r, c.c.y, c.c.z]; });
  await clickAt(await W(...hole)); await clickAt(await W(30, 12, 10));
  const mres = await p.evaluate(() => { const M = window.__rezets.S.measure; return { picks: M.picks.map(x => x.kind), main: M.result?.main, rows: M.result?.rows }; });
  console.log('measure clicks', JSON.stringify(mres));
  await p.screenshot({ path: 'shot11.png' });
  console.log(logs.join('\n')); await b.close();
})();

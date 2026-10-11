// Sketch tools: fillet, trim, offset, mirror, slot, polygon.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Новая деталь' }).click(); await p.waitForTimeout(300);
  await p.locator('.row', { hasText: 'Спереди' }).click(); await p.keyboard.press('s'); await p.waitForTimeout(600);
  const box = await (await p.$('#cv')).boundingBox();
  const clickUV = async (u, v) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; const f = R.featById(R.S.editing); return R.toScreen(R.toWorld(f.plane, u, v)); }, [u, v]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 2 }); await p.waitForTimeout(60); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(100); };
  const st = () => p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; const a = R.S.analysis; const cnt = {}; for (const e of Object.values(sk.ents)) cnt[e.t + (e.constr ? '*' : '')] = (cnt[e.t + (e.constr ? '*' : '')] || 0) + 1; const cc = {}; for (const c of Object.values(sk.cons)) cc[c.t] = (cc[c.t] || 0) + 1; return { dof: a.dof, red: a.redundant.size, ents: cnt, cons: cc }; });
  // rectangle 0..60 x 0..40 with origin corner and dims
  await p.keyboard.press('r'); await clickUV(0, 0); await clickUV(60, 40);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; const ids = Object.values(sk.ents).map((e) => e.id); const L = Object.values(sk.ents); const bottom = L.find((e) => Math.abs(R.gp(sk, e.p1).y) < 1e-6 && Math.abs(R.gp(sk, e.p2).y) < 1e-6); const left = L.find((e) => Math.abs(R.gp(sk, e.p1).x) < 1e-6 && Math.abs(R.gp(sk, e.p2).x) < 1e-6);
    let n = 1000; const add = (c) => { c.id = String(n++); R.tryAddConstraint(sk, c); }; add({ t: 'dist', refs: [bottom.p1, bottom.p2], v: 60 }); add({ t: 'dist', refs: [left.p1, left.p2], v: 40 }); R.solveSketch(sk); void ids; });
  await p.keyboard.press('Escape'); await p.keyboard.press('Escape');
  await p.evaluate(() => { window.__rezets.S.analysis = null; }); await clickUV(-30, -30); 
  L('rect', JSON.stringify(await st()));
  // fillet corner (60,40) r=8
  await p.click('button.tool:has-text("Скругл.")'); await p.fill('#opFillet', '8'); await p.press('#opFillet', 'Enter');
  await clickUV(60, 40); L('fillet', JSON.stringify(await st()));
  // fillet the origin corner too (it carries the coincident-with-origin)
  await clickUV(0, 0); L('fillet origin', JSON.stringify(await st()));
  // offset: select everything, offset 3 outward
  await p.keyboard.press('Escape'); await p.keyboard.press('s');
  await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; R.S.sel = new Set(Object.values(sk.ents).filter((e) => !e.constr).map((e) => 'e:' + e.id)); });
  await p.click('button.tool:has-text("Смещение")'); await p.waitForTimeout(200); await p.fill('#opOffset', '3'); await p.press('#opOffset', 'Enter'); await p.waitForTimeout(300);
  const so = await st(); L('offset', JSON.stringify(so));
  const bbox = await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; const xs = Object.values(sk.pts).map((q) => q.x), ys = Object.values(sk.pts).map((q) => q.y); return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)].map((v) => +v.toFixed(6)); });
  L('bbox after offset', bbox, 'expect [-3, 63, -3, 43] (arc centres inside)');
  // edit the offset dimension to 5 via API
  L('offset edit', await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; const c = Object.values(sk.cons).find((c) => c.t === 'offd'); c.v = 5; const ok = R.solveSketch(sk); const xs = Object.values(sk.pts).map((q) => q.x); return [ok, Math.min(...xs).toFixed(6), Math.max(...xs).toFixed(6)]; }));
  L('regions', await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; return R.buildRegions(sk).faces.map((f) => f.area.toFixed(3)).join(' '); }), 'expect inner', (2400 - 2 * (64 - Math.PI * 16)).toFixed(3), 'ring', (3500 - 2 * (169 - Math.PI * 169 / 4) - (2400 - 2 * (64 - Math.PI * 16))).toFixed(3));
  // trim: a vertical line crossing the shape at x=30 from y=-10 to y=50, then trim its outer parts
  await p.keyboard.press('l'); await clickUV(20, -10); await clickUV(20, 50); await p.keyboard.press('Escape'); await p.keyboard.press('Escape');
  const before = await st();
  await p.keyboard.press('t'); await clickUV(20, 48); await clickUV(20, -8);
  const v20 = () => p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; return Object.values(sk.ents).filter((e) => e.t === 'line' && Math.abs(R.gp(sk, e.p1).x - 20) < 1e-3 && Math.abs(R.gp(sk, e.p2).x - 20) < 1e-3).map((e) => [R.gp(sk, e.p1).y, R.gp(sk, e.p2).y].map((v) => +v.toFixed(3))); });
  L('x=20 pieces', JSON.stringify(await v20()), await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; return Object.values(sk.ents).filter((e) => e.t === 'line').map((e) => [R.gp(sk, e.p1), R.gp(sk, e.p2)].map((q) => q.x.toFixed(1) + ',' + q.y.toFixed(1)).join('>')).join(' | '); }));
  L('trim ends', JSON.stringify(before.ents), '->', JSON.stringify((await st()).ents));
  // trim the middle piece of the offset bottom line between x=30 and nothing else -> removes to the end
  L('tool', await p.evaluate(() => window.__rezets.S.tool), await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; const e = Object.values(sk.ents).find((e) => e.t === 'line' && Math.abs(R.gp(sk, e.p1).x - 20) < 1e-3); return JSON.stringify(R.cutsOn(sk, e).map((c) => [c.t.toFixed(3), c.f.id])); }));
  L('elem', await p.evaluate(() => { const R = window.__rezets; const f = R.featById(R.S.editing); const s = R.toScreen(R.toWorld(f.plane, 20, 30)); const c = document.getElementById('cv').getBoundingClientRect(); const el = document.elementFromPoint(c.left + s.x, c.top + s.y); return el.tagName + '#' + el.id + '.' + el.className + ' ' + el.textContent.slice(0, 20); }));
  await clickUV(20, 30); L('trim inner piece', JSON.stringify((await st()).ents), JSON.stringify(await v20()));
  await p.screenshot({ path: 's30_a.png' });
  await p.keyboard.press('Escape');
  // slot and polygon in empty space
  await p.click('button.tool:has-text("Паз")'); await clickUV(100, 0); await clickUV(140, 0); await clickUV(120, 6);
  L('slot', JSON.stringify(await st()));
  await p.click('button.tool:has-text("Многоуг.")'); await p.fill('#opSides', '5'); await p.press('#opSides', 'Enter'); await clickUV(120, 40); await clickUV(130, 45);
  L('polygon', JSON.stringify(await st()));
  // mirror the polygon about the V axis
  await p.keyboard.press('Escape'); await p.keyboard.press('s');
  await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; const ids = Object.values(sk.ents).filter((e) => e.t === 'line' && R.gp(sk, e.p1).x > 110 && R.gp(sk, e.p1).y > 30).map((e) => 'e:' + e.id); R.S.sel = new Set([...ids, 'e:V']); });
  await p.click('button.tool:has-text("Зеркало")'); await p.waitForTimeout(200);
  const mir = await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; const xs = Object.values(sk.pts).map((q) => q.x); return { minX: Math.min(...xs).toFixed(4), sym: Object.values(sk.cons).filter((c) => c.t === 'symmetric').length }; });
  L('mirror', JSON.stringify(mir), JSON.stringify(await st()));
  await p.keyboard.press('f'); await p.waitForTimeout(300); await p.screenshot({ path: 's30_b.png' });
  L(logs.join('\n')); await b.close();
})();

// Spline and ellipse drawn with the mouse, used in regions and extrudes.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Новая деталь' }).click(); await p.waitForTimeout(300);
  await p.locator('.row', { hasText: 'Спереди' }).click(); await p.keyboard.press('s'); await p.waitForTimeout(600);
  const box = await (await p.$('#cv')).boundingBox();
  const clickUV = async (u, v, dbl) => { const s = await p.evaluate(([u, v]) => { const R = window.__rezets; const f = R.featById(R.S.editing); return R.toScreen(R.toWorld(f.plane, u, v)); }, [u, v]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 2 }); await p.waitForTimeout(60); if (dbl) await p.mouse.dblclick(box.x + s.x, box.y + s.y); else { await p.mouse.down(); await p.mouse.up(); } await p.waitForTimeout(100); };
  const st = () => p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; const reg = R.buildRegions(sk); return { dof: R.S.analysis?.dof, ents: Object.values(sk.ents).map((e) => e.t + (e.closed ? '(closed)' : '')), areas: reg.faces.map((f) => +f.area.toFixed(2)) }; });
  await p.click('button.tool:has-text("Эллипс")'); await clickUV(0, 0); await clickUV(30, 0); await clickUV(10, 15);
  L('ellipse', JSON.stringify(await st()), 'exact area', (Math.PI * 30 * 15).toFixed(2));
  // dimensions: centre to axis end, minor radius
  await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; const e = Object.values(sk.ents).find((x) => x.t === 'ellipse'); let n = 900; const add = (c) => { c.id = String(n++); return R.tryAddConstraint(sk, c).status; };
    window.__st = [add({ t: 'dist', refs: [e.c, e.p1], v: 30 }), add({ t: 'rad', refs: [e.id], v: 15 }), add({ t: 'hpts', refs: [e.c, e.p1] })]; sk.nid = n; R.solveSketch(sk); });
  await p.keyboard.press('Escape'); await clickUV(-50, -50); await p.keyboard.press('Escape');
  L('ellipse dims', await p.evaluate(() => JSON.stringify(window.__st)), JSON.stringify(await st()), '(centre at origin -> dof 0)');
  // closed spline to the right
  await p.click('button.tool:has-text("Сплайн")'); for (const [u, v] of [[60, 0], [80, 10], [90, -10], [70, -20]]) await clickUV(u, v); await clickUV(60, 0);
  L('spline', JSON.stringify(await st()));
  // open spline, finished with Enter
  // The Spline tool is still on after the closed one (its button pressed again would put it down).
  if ((await p.getAttribute('button.tool:has-text("Сплайн")', 'aria-pressed')) !== 'true') await p.click('button.tool:has-text("Сплайн")'); for (const [u, v] of [[0, 40], [20, 50], [40, 40]]) await clickUV(u, v); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  L('open spline', JSON.stringify((await st()).ents));
  await p.keyboard.press('f'); await p.waitForTimeout(300); await p.screenshot({ path: 's42_sketch.png' });
  await p.click('#corner .ok'); await p.waitForTimeout(500);
  await p.keyboard.press('e'); await p.waitForTimeout(400); await p.locator('.pm .chip', { hasText: 'Все' }).click(); await p.waitForTimeout(300); await p.fill('#pmDepth', '10'); await p.press('#pmDepth', 'Enter'); await p.waitForTimeout(800);
  L('extrude', await p.evaluate(() => { const R = window.__rezets; return [R.geoVolume(R.S.body).toFixed(2), JSON.stringify(R.S.errors)]; }));
  await p.click('[data-view="iso"]'); await p.waitForTimeout(600); await p.screenshot({ path: 's42_body.png' });
  L(logs.join('\n')); await b.close();
})();

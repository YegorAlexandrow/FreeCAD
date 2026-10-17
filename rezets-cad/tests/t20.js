const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  const tabs = () => p.evaluate(() => window.__rezets.S.project.docs.map((d) => d.name + (d.id === window.__rezets.S.project.active ? '*' : '')));
  L('tabs0', await tabs());
  // new part, then back
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Новая деталь' }).click(); await p.waitForTimeout(400);
  L('tabs1', await tabs(), await p.evaluate(() => window.__rezets.S.body));
  await p.pickDoc('Кронштейн'); await p.waitForTimeout(600);
  L('back vol', await p.evaluate(() => { const R = window.__rezets; return R.geoVolume(R.S.body); }));
  // STEP import
  await p.setInputFiles('#stepIn', __dirname + '/../testdata/servo.step');
  await p.waitForFunction(() => window.__rezets.S.mode === 'import', null, { timeout: 60000 });
  await p.waitForTimeout(800);
  L('import', await p.evaluate(() => { const R = window.__rezets; const e = R.activeEntry(); return { name: e.name, vol: R.geoVolume(R.S.body), faces: e.data.faces.length, cyls: e.data.cyls.map((c) => +c.r.toFixed(3)).sort((a, b) => a - b) }; }), await tabs());
  await p.screenshot({ path: 's20_import.png' });
  // measure on import works
  await p.keyboard.press('m'); await p.waitForTimeout(300); L('measure circles', await p.evaluate(() => window.__rezets.S.measure ? 'open' : 'closed')); await p.keyboard.press('Escape');
  // assembly
  await p.click('#bAdd'); await p.locator('#menu button', { hasText: 'Новая сборка' }).click(); await p.waitForTimeout(400);
  await p.keyboard.press('i'); await p.waitForTimeout(200);
  await p.locator('.chip', { hasText: 'Кронштейн' }).click(); await p.waitForTimeout(600);
  await p.locator('.chip', { hasText: 'servo' }).click(); await p.waitForTimeout(600);
  await p.keyboard.press('Escape');
  const an = () => p.evaluate(() => { const S = window.__rezets.S; return { dof: S.asmAnalysis?.dof, mates: S.doc.mates.map((m) => m.name), comps: S.doc.comps.map((c) => c.name + (c.fixed ? '(f)' : '')), state: document.getElementById('stState').textContent }; });
  L('asm', JSON.stringify(await an()));
  await p.screenshot({ path: 's20_asm0.png' });
  // programmatic mates: servo shaft axis r=2.4 concentric with bracket hole r=2.5; servo flat face coincident with bracket top face
  const mate = (sel) => p.evaluate((sel) => {
    const R = window.__rezets; const S = R.S; const [c1, c2] = S.doc.comps;
    const find = (c, f) => { const inf = R.docInfo(c.doc); const i = inf.ents.findIndex((e) => f(e)); if (i < 0) return null; const e = inf.ents[i]; return { comp: c.id, kind: e.kind, p: e.p.toArray(), d: (e.n || e.d).toArray(), r: e.r, e: i }; };
    const fa = new Function('e', 'return ' + sel.a), fb = new Function('e', 'return ' + sel.b);
    R.cmdMate(); S.pm.picks = [find(c1, fa), find(c2, fb)]; if (!S.pm.picks[0] || !S.pm.picks[1]) return 'not found';
    if (sel.type) S.pm.type = sel.type; if (sel.v != null) S.pm.v = sel.v; R.previewMate(); const res = S.pm.result; R.okMate(); const out = { res, type: S.doc.mates.at(-1)?.type };
    return out;
  }, sel);
  L('ents bracket', await p.evaluate(() => { const R = window.__rezets; const inf = R.docInfo(R.S.doc.comps[0].doc); return inf.ents.filter((e) => e.kind === 'axis').map((e) => e.r.toFixed(2) + '@' + e.p.toArray().map((v) => v.toFixed(1)) + ' d' + e.d.toArray().map((v) => v.toFixed(2))).join(' | '); }));
  L('ents servo', await p.evaluate(() => { const R = window.__rezets; const inf = R.docInfo(R.S.doc.comps[1].doc); return [inf.ents.filter((e) => e.kind === 'axis').map((e) => e.r.toFixed(2) + '@' + e.p.toArray().map((v) => v.toFixed(1)) + ' d' + e.d.toArray().map((v) => v.toFixed(2))).join(' | '), inf.ents.filter((e) => e.kind === 'plane').map((e) => e.n.toArray().map((v) => v.toFixed(2)) + ' p' + e.p.toArray().map((v) => v.toFixed(1)) + ' n' + e.tris.length).join(' | ')]; }));
  L('m1', JSON.stringify(await mate({ a: "e.kind==='plane' && e.n.y>0.99 && e.p.y>11.9 && e.p.y<12.1", b: "e.kind==='plane' && e.n.y<-0.99 && e.tris.length>100", type: 'distance', v: 3 })), JSON.stringify(await an()));
  L('m2', JSON.stringify(await mate({ a: "e.kind==='axis' && Math.abs(e.r-5)<0.01", b: "e.kind==='axis' && Math.abs(e.r-2.4)<0.01" })), JSON.stringify(await an()));
  L('m3 dup', JSON.stringify(await mate({ a: "e.kind==='axis' && Math.abs(e.r-5)<0.01", b: "e.kind==='axis' && Math.abs(e.r-2.4)<0.01" })));
  L('m4 conflict', JSON.stringify(await mate({ a: "e.kind==='plane' && e.n.y>0.99 && e.p.y>11.9 && e.p.y<12.1", b: "e.kind==='plane' && e.n.y<-0.99 && e.tris.length>100", type: 'distance', v: 7 })));
  await p.keyboard.press('Escape');
  // check geometric result: servo shaft axis coincides with bracket hole axis
  L('check', JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const [m1, m2] = S.doc.mates; const res = (m) => R.mateResiduals(m, R.worldEnt(m.a, R.poseOf(S.doc.comps.find((c) => c.id === m.a.comp))), R.worldEnt(m.b, R.poseOf(S.doc.comps.find((c) => c.id === m.b.comp)))).map((v) => +v.toExponential(1)); return [res(m1), res(m2)]; })));
  await p.evaluate(() => window.__rezets.asmRefresh(true)); await p.keyboard.press('f'); await p.waitForTimeout(500);
  await p.screenshot({ path: 's20_asm1.png' });
  // drag the servo: it may only rotate about the shaft (1 dof)
  const cvb = await (await p.$('#cv')).boundingBox();
  const sc = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const c = S.doc.comps[1]; const pz = R.poseOf(c).t; return R.toScreen(pz); });
  L('servo screen', sc);
  // undo / redo of mates
  await p.keyboard.press('Control+z'); await p.waitForTimeout(400); L('undo', JSON.stringify(await an()));
  await p.keyboard.press('Control+y'); await p.waitForTimeout(400); L('redo', JSON.stringify(await an()));
  // persistence: reload
  await p.waitForTimeout(800); await p.reload(); await p.waitForFunction(() => window.__rezets?.S.project, null, { timeout: 30000 }); await p.waitForTimeout(2500);
  L('after reload', await tabs(), JSON.stringify(await an()));
  await p.screenshot({ path: 's20_reload.png' });
  L(logs.join('\n')); await b.close();
})();

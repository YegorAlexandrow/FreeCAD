// Editing a part inside its assembly: others muted and not pickable, the edit reaches the assembly, the view is kept.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.evaluate(() => { const R = window.__rezets; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id); const c = R.S.doc.comps[1]; const T = c.T; const r = [0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, 0]; for (let i = 0; i < 12; i++) T[i] = r[i]; R.asmRefresh(true); });
  await p.click('[data-view="iso"]'); await p.waitForTimeout(500);
  const st = () => p.evaluate(() => { const R = window.__rezets; return { mode: R.S.mode, doc: R.S.project.active, others: R.ctxGroup.children.length, bar: !document.getElementById('ctxBar').hidden && document.getElementById('ctxBar').textContent, cam: [...R.S.doc.comps ? [] : []] }; });
  const asmDoc = await p.evaluate(() => window.__rezets.S.project.active);
  const before = await p.evaluate(() => { const R = window.__rezets; const c = R.S.doc.comps[1]; return { T: c.T.slice(12, 15).map((x) => +x.toFixed(2)), vol: R.geoVolume(R.docInfo(c.doc).geo).toFixed(1) }; });
  // right-click the second component in the tree -> edit in context
  await p.locator('#side').getByText('<2>').click({ button: 'right' }); await p.waitForTimeout(200);
  L('menu', await p.$$eval('#menu button', (els) => els.map((e) => e.textContent).filter(Boolean).join(' | ')));
  await p.locator('#menu button', { hasText: 'Редактировать в сборке' }).click(); await p.waitForTimeout(800);
  L('in context', JSON.stringify(await st()));
  await p.screenshot({ path: 's52_ctx.png' });
  // a click on the muted component must not pick it: raycast only hits the edited body
  L('ctx meshes pickable', await p.evaluate(() => window.__rezets.ctxGroup.children.some((g) => g.children.some((m) => m.userData.comp))));
  // change the boss depth of the part
  const nv = await p.evaluate(() => { const R = window.__rezets; const f = R.S.doc.features.find((x) => x.type === 'extrude'); f.depth += 10; R.rebuild(); return R.geoVolume(R.S.body).toFixed(1); });
  await p.locator('#ctxBar button').click(); await p.waitForTimeout(800);
  L('back', JSON.stringify(await st()), 'asm doc', asmDoc);
  const after = await p.evaluate(() => { const R = window.__rezets; const c = R.S.doc.comps[1]; return { T: c.T.slice(12, 15).map((x) => +x.toFixed(2)), vol: R.geoVolume(R.docInfo(c.doc).geo).toFixed(1) }; });
  L('comp before', JSON.stringify(before), 'after', JSON.stringify(after), 'part vol edited', nv);
  await p.screenshot({ path: 's52_back.png' });
  L(logs.join('\n')); await b.close();
})();

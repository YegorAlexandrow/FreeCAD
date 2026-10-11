// Mates on a big imported STEP (servo, ~170k triangles): hover must stay fast, cylinders must be pickable.
// Needs testdata/big/servo_proj.json (not in git: the user's project, 16 MB).
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/servo_proj.json', 'utf8');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  let t0 = Date.now();
  L('open', await p.evaluate((s) => { const R = window.__rezets; const t = performance.now(); R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d2'); return [R.S.mode, R.S.doc.comps.length, Math.round(performance.now() - t)]; }, proj), 'ms total', Date.now() - t0);
  await p.click('[data-view="iso"]'); await p.waitForTimeout(300); await p.keyboard.press('f'); await p.waitForTimeout(500);
  await p.evaluate(() => window.__rezets.cmdMate()); await p.waitForTimeout(300);
  const box = await (await p.$('#cv')).boundingBox();
  // centre of the servo on screen
  const times = [];
  for (let i = 0; i < 12; i++) { const x = box.x + box.width * (0.35 + 0.03 * i), y = box.y + box.height * (0.4 + 0.015 * i); t0 = Date.now(); await p.mouse.move(x, y); await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => r()))); times.push(Date.now() - t0); }
  L('hover ms', times.join(' '), 'max', Math.max(...times));
  L('hover', await p.evaluate(() => JSON.stringify(window.__rezets.S.pm?.hover)?.slice(0, 200)));
  const st = await p.evaluate(() => { const R = window.__rezets; const inf = R.docInfo('d3'); const k = {}; for (const e of inf.ents) k[e.kind] = (k[e.kind] || 0) + 1; return { tris: inf.geo.getAttribute('position').count / 3, ents: k, cyls: inf.cyls.length }; });
  L('servo', JSON.stringify(st));
  // a visible cylinder face of each component, clicked in turn
  const target = (doc) => p.evaluate((doc) => { const R = window.__rezets; const c = R.S.doc.comps.find((x) => x.doc === doc); const inf = R.docInfo(doc); const pos = inf.geo.getAttribute('position'); const M = c.T;
    const cv = document.getElementById('cv').getBoundingClientRect(); const out = [];
    for (const e of inf.ents.filter((e) => e.kind === 'axis').sort((a, b) => b.r - a.r)) for (const t of e.tris.filter((_, i) => i % 7 === 0)) {
      let x = 0, y = 0, z = 0; for (let k = 0; k < 3; k++) { x += pos.getX(3 * t + k) / 3; y += pos.getY(3 * t + k) / 3; z += pos.getZ(3 * t + k) / 3; }
      const w = [x * M[0] + y * M[4] + z * M[8] + M[12], x * M[1] + y * M[5] + z * M[9] + M[13], x * M[2] + y * M[6] + z * M[10] + M[14]]; const s = R.toScreen(new e.p.constructor(...w));
      if (!s || s.x < 20 || s.y < 20 || s.x > cv.width - 20 || s.y > cv.height - 20) continue;
      const q = R.asmPick({ clientX: cv.left + s.x, clientY: cv.top + s.y }); if (q?.comp === c.id && q.ent?.kind === 'axis' && q.ent.e === inf.ents.indexOf(e)) return { x: cv.left + s.x, y: cv.top + s.y, r: e.r };
    } return null; }, doc);
  for (const doc of ['d3', 'd1']) {
    const tg = await target(doc); if (!tg) { L('no visible cylinder on', doc); continue; }
    t0 = Date.now(); await p.mouse.move(tg.x, tg.y); await p.mouse.click(tg.x, tg.y); await p.waitForTimeout(100); L('click', doc, 'r', tg.r, 'ms', Date.now() - t0);
  }
  L('picks', await p.evaluate(() => JSON.stringify(window.__rezets.S.pm?.picks?.map((r) => r.comp + ':' + r.kind + (r.r ? ' r' + (+r.r).toFixed(2) : '')))), 'mate', await p.evaluate(() => JSON.stringify(window.__rezets.S.pm?.mate?.type || window.__rezets.S.pm?.mate)));
  await p.screenshot({ path: 's51.png' });
  L(logs.slice(0, 10).join('\n')); await b.close();
})();

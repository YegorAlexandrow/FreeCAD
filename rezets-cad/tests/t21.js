const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.setInputFiles('#stepIn', __dirname + '/../testdata/servo.step');
  await p.waitForFunction(() => window.__rezets.S.mode === 'import', null, { timeout: 60000 }); await p.waitForTimeout(500);
  await p.click('text=Вставить в новую сборку'); await p.waitForTimeout(500);
  await p.keyboard.press('i'); await p.locator('.chip', { hasText: 'Кронштейн' }).click(); await p.waitForTimeout(500); await p.keyboard.press('Escape');
  await p.keyboard.press('f'); await p.waitForTimeout(400);
  const an = () => p.evaluate(() => { const S = window.__rezets.S; return { dof: S.asmAnalysis?.dof, mates: S.doc.mates.map((m) => m.name + ':' + m.type), comps: S.doc.comps.map((c) => c.name + (c.fixed ? '(f)' : '')) }; });
  L('asm', JSON.stringify(await an()));
  const box = await (await p.$('#cv')).boundingBox();
  // screen position of a world point on a component entity: find a triangle centre of an entity
  const entScreen = (ci, sel) => p.evaluate(([ci, sel]) => {
    const R = window.__rezets; const S = R.S; const c = S.doc.comps[ci]; const inf = R.docInfo(c.doc); const f = new Function('e', 'return ' + sel);
    const ents = inf.ents.filter(f); if (!ents.length) return null; const e = ents[0]; const pos = inf.geo.getAttribute('position');
    const M = new (R.poseOf(c).t.constructor)(); void M;
    // pick the triangle whose centre is nearest to the camera-facing side: try several
    const pose = R.poseOf(c); let best = null;
    for (const t of e.tris) { const v = [0, 1, 2].map((k) => ({ x: pos.getX(3 * t + k), y: pos.getY(3 * t + k), z: pos.getZ(3 * t + k) })); const cx = (v[0].x + v[1].x + v[2].x) / 3, cy = (v[0].y + v[1].y + v[2].y) / 3, cz = (v[0].z + v[1].z + v[2].z) / 3;
      const w = pose.t.clone().set(cx, cy, cz).applyQuaternion(pose.q).add(pose.t); const s = R.toScreen(w); best = best || s; if (Math.random() < 0.02) best = s; }
    return best;
  }, [ci, sel]);
  // UI mate: press M, click servo flange-underside? use a visible face: servo top flange (n +y, big) and bracket top face
  await p.keyboard.press('m'); await p.waitForTimeout(200);
  const tryClick = async (ci, sel, want) => {
    for (let k = 0; k < 25; k++) { const s = await entScreen(ci, sel); if (!s) return false; await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 2 }); await p.waitForTimeout(60);
      const hv = await p.evaluate(() => window.__rezets.S.pm?.hover); if (hv && hv.comp === want.comp && hv.kind === want.kind) { await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(250); return true; } }
    return false;
  };
  const cid = await p.evaluate(() => window.__rezets.S.doc.comps.map((c) => c.id));
  L('click servo axis', await tryClick(0, "e.kind==='axis' && Math.abs(e.r-2.4)<0.01", { comp: cid[0], kind: 'axis' }));
  L('click bracket bore', await tryClick(1, "e.kind==='axis' && Math.abs(e.r-12)<0.01", { comp: cid[1], kind: 'axis' }));
  L('pm', JSON.stringify(await p.evaluate(() => { const pm = window.__rezets.S.pm; return { picks: pm.picks.map((x) => x.kind + x.r), type: pm.type, res: pm.result }; })));
  await p.screenshot({ path: 's21_matepm.png' });
  await p.keyboard.press('Enter'); await p.waitForTimeout(300); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  L('after mate', JSON.stringify(await an()));
  // drag servo: should slide along/rotate about the bore axis only
  const before = await p.evaluate(() => { const R = window.__rezets; return R.S.doc.comps[1].T.slice(); });
  const s0 = await entScreen(1, "e.kind==='plane' && e.n.y>0.99 && e.tris.length>50");
  await p.mouse.move(box.x + s0.x, box.y + s0.y); await p.mouse.down(); await p.mouse.move(box.x + s0.x + 40, box.y + s0.y - 60, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(300);
  const after = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const m = S.doc.mates[0]; const res = R.mateResiduals(m, R.worldEnt(m.a, R.poseOf(S.doc.comps.find((c) => c.id === m.a.comp))), R.worldEnt(m.b, R.poseOf(S.doc.comps.find((c) => c.id === m.b.comp)))); return { T: S.doc.comps[1].T.slice(12, 15), res: Math.max(...res.map(Math.abs)) }; });
  L('drag moved', before.slice(12, 15).map((v) => v.toFixed(2)), '->', after.T.map((v) => v.toFixed(2)), 'residual', after.res.toExponential(1));
  await p.screenshot({ path: 's21_drag.png' });
  // fixed comp drag gives message
  L(logs.join('\n')); await b.close();
})();

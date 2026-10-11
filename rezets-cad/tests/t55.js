// Distance mates between unlike entities: axis to plane (with reverse) and vertex to axis.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  const r = await p.evaluate(() => {
    const R = window.__rezets; const out = {}; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id);
    const asm = R.S.doc; const [c1, c2] = asm.comps; c2.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 200, 10, 5, 1]; R.asmRefresh(true);
    const inf = R.docInfo(c1.doc); const bore = inf.ents.map((e, i) => ({ e, i })).find((x) => x.e.kind === 'axis' && Math.abs(x.e.r - 12) < 1e-6);
    const side = inf.ents.map((e, i) => ({ e, i })).find((x) => x.e.kind === 'plane' && x.e.n.x > 0.99);
    const ref = (c, x) => ({ comp: c.id, kind: x.e.kind, p: x.e.p.toArray(), d: (x.e.n || x.e.d).toArray(), r: x.e.r, e: x.i });
    R.cmdMate(); const pm = R.S.pm; pm.picks = [ref(c1, side), ref(c2, bore)]; pm.type = 'distance'; R.previewMate(); pm.type = 'distance'; pm.v = 30; R.previewMate();
    out.opts = document.querySelector('#side .pm').textContent.includes('Расстояние'); R.okPM();
    const axisX = () => { const pose = R.poseOf(c2); return +bore.e.p.clone().applyQuaternion(pose.q).add(pose.t).x.toFixed(4); };
    const sideX = side.e.p.x; out.mate = asm.mates.map((m) => m.type + ':' + m.a.kind + '/' + m.b.kind + ':' + m.v).join(); out.d1 = +(axisX() - sideX).toFixed(4);
    out.an1 = JSON.stringify({ dof: R.S.asmAnalysis.dof, red: [...R.S.asmAnalysis.redundant] }); R.reverseMate(asm.mates[0]); out.an2 = JSON.stringify({ dof: R.S.asmAnalysis.dof, red: [...R.S.asmAnalysis.redundant] }); out.d2 = +(axisX() - sideX).toFixed(4);
    return out;
  });
  L(JSON.stringify(r), 'expect axis-plane distance mate, d1 = ±30, d2 = -d1');
  await p.keyboard.press('Escape'); await p.click('[data-view="iso"]'); await p.waitForTimeout(400); await p.keyboard.press('f'); await p.waitForTimeout(400);
  await p.locator('#side .row', { hasText: 'Расстояние1' }).click(); await p.waitForTimeout(300);
  L('selected row', await p.$eval('#side .row.sel', (e) => e.textContent));
  await p.mouse.move(700, 600); await p.waitForTimeout(200); await p.screenshot({ path: 's55_sel.png' });
  L(logs.join('\n')); await b.close();
})();

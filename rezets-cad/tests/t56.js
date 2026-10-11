// Tape measure in an assembly: picks on different components, in world coordinates.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.evaluate(() => { const R = window.__rezets; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id);
    R.S.doc.comps[1].T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 150, 7, -20, 1]; R.asmRefresh(true); });
  await p.click('[data-view="iso"]'); await p.waitForTimeout(400); await p.keyboard.press('f'); await p.waitForTimeout(400);
  await p.locator('button.tool:has-text("Рулетка")').click(); await p.waitForTimeout(200);
  const box = await (await p.$('#cv')).boundingBox();
  const clickAt = async (ci, local) => { const s = await p.evaluate(([ci, local]) => { const R = window.__rezets; const c = R.S.doc.comps[ci]; const pose = R.poseOf(c); return R.toScreen(pose.t.clone().set(...local).applyQuaternion(pose.q).add(pose.t)); }, [ci, local]); await p.mouse.move(box.x + s.x, box.y + s.y, { steps: 2 }); await p.waitForTimeout(100); await p.mouse.click(box.x + s.x, box.y + s.y); await p.waitForTimeout(200); };
  const res = () => p.evaluate(() => { const M = window.__rezets.S.measure; return M && JSON.stringify({ picks: M.picks.map((x) => x.kind), main: M.result?.main, rows: M.result?.rows }); });
  // top faces of the two plates (y = 12 on comp 0, y = 19 world on comp 1)
  await clickAt(0, [-40, 12, 20]); await clickAt(1, [40, 12, 20]);
  L('faces', await res(), 'expect 7 мм between parallel faces');
  // bore of each bracket (r 12): centre to centre
  await clickAt(0, [0, 32, 0]); L('one', await res());
  await p.evaluate(() => { window.__rezets.S.measure.picks = []; });
  await clickAt(0, [12, 25, 0]); await clickAt(1, [12, 25, 0]);
  L('bores', await res(), 'expect centres 151.49 (dx 150 dy 7 dz 20)');
  await p.screenshot({ path: 's56.png' });
  await p.keyboard.press('Escape'); await p.waitForTimeout(200); L('closed', await res(), await p.$eval('#side', (e) => e.textContent.slice(0, 40)));
  L(logs.join('\n')); await b.close();
})();

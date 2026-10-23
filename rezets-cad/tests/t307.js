// An explode step takes its direction from a face's normal or a cylinder's axis, turned as the part is.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id); S.doc.comps[1].T[12] += 300; const c = S.doc.comps[0];
    // turned 90° about X: the part's top face now faces −Z
    const M = new (R.asmGroup.matrix.constructor)().fromArray(c.T); const Rx = new (R.asmGroup.matrix.constructor)().makeRotationX(Math.PI / 2); c.T = Rx.multiply(M).toArray(); R.asmRefresh(true); R.cmdExplode(); });
  await p.mouse.move(700, 450); await p.keyboard.press('f'); await p.waitForTimeout(1200);
  await p.click('#side .chip >> text=По грани или оси'); await p.waitForTimeout(100);
  const at = await p.evaluate(() => { const R = window.__rezets; const r = document.getElementById('cv').getBoundingClientRect(); for (let y = r.top + 40; y < r.bottom - 40; y += 10) for (let x = r.left + 40; x < r.right - 40; x += 10) { const h = R.asmPick({ clientX: x, clientY: y }); if (h?.ent?.kind === 'plane' && Math.abs(h.ent.d[1] - 1) < 1e-6) return [x, y]; } return null; });
  await p.mouse.click(at[0], at[1]); await p.waitForTimeout(300);
  const r = await p.evaluate(() => ({ dir: window.__rezets.S.pm.cur.dir, pick: !!window.__rezets.S.pm.pickDir }));
  console.log(JSON.stringify(r)); console.log('expect dir [0,0,1] (the part\'s +Y face turned by 90° about X), pick false');
  console.log(logs.join('\n')); await b.close(); })();

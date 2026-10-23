// E10: in the mate panel the digit keys pick the mate type and R turns the part over.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const base = S.project.docs.find((d) => d.name === 'Кронштейн');
    R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(base.id); R.asmInsert(base.id); const c = S.doc.comps[1]; c.T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 40, 25, -10, 1];
    R.cmdMate(); R.addMatePick(R.stdPlaneRef(c, 'top')); R.addMatePick(R.stdPlaneRef(S.doc.comps[0], 'top')); });
  await p.waitForTimeout(300); const types = await p.$$eval('[data-mtype]', (e) => e.map((x) => x.dataset.mtype));
  await p.mouse.move(700, 400); await p.keyboard.press('2'); await p.waitForTimeout(200); const t2 = await p.evaluate(() => window.__rezets.S.pm.type);
  await p.keyboard.press('1'); await p.waitForTimeout(200); const f0 = await p.evaluate(() => window.__rezets.S.pm.flip); await p.keyboard.press('r'); await p.waitForTimeout(200); const f1 = await p.evaluate(() => window.__rezets.S.pm.flip);
  console.log(JSON.stringify({ types, t2, f0, f1 })); console.log('expect t2 = types[1]; f1 = !f0');
  console.log(logs.join('\n')); await b.close(); })();

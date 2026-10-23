// Numeric move and turn of an assembly component: ΔX/ΔY/ΔZ and an angle about an axis through its middle, applied
// on top of its mates; a fixed one says so.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const base = S.project.docs.find((d) => d.name === 'Кронштейн'); R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(base.id); R.asmInsert(base.id); R.cmdMoveComp(S.doc.comps[1]); });
  await p.waitForTimeout(300); const t0 = await p.evaluate(() => window.__rezets.poseOf(window.__rezets.S.doc.comps[1]).t.toArray());
  await p.fill('#mvX', '10'); await p.fill('#mvZ', '-5'); await p.locator('#mvZ').press('Enter'); await p.waitForTimeout(300);
  const t1 = await p.evaluate(() => window.__rezets.poseOf(window.__rezets.S.doc.comps[1]).t.toArray());
  await p.fill('#mvAng', '90'); await p.locator('#mvAng').press('Enter'); await p.waitForTimeout(300);
  const q = await p.evaluate(() => window.__rezets.poseOf(window.__rezets.S.doc.comps[1]).q.toArray().map((v) => +v.toFixed(3)));
  const shot = await p.evaluate(() => [...document.querySelectorAll('#side input')].map((i) => i.value).concat([window.__rezets.S.pm?.ang, document.activeElement?.id]));
  console.log(JSON.stringify({ d: t1.map((v, i) => +(v - t0[i]).toFixed(3)), q, fields: shot }));
  console.log('expect d [10,0,-5]; q a 90° turn about Z [0,0,0.707,0.707]; fields reset to 0');
  console.log(logs.join('\n')); await b.close(); })();

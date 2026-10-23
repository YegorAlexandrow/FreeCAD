// Exploded view steps: the distance of a step is edited in its row, and steps move up and down the order.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id); const [c0, c] = S.doc.comps;
    S.doc.explode = { on: true, steps: [{ id: 'x1', comps: [c0.id], dir: [0, 1, 0], d: 50 }, { id: 'x2', comps: [c.id], dir: [1, 0, 0], d: 80 }] }; R.asmRefresh(true); R.cmdExplode(); });
  await p.waitForTimeout(300);
  const inp = p.locator('#side .rel input.inline-val').first(); await inp.fill('120'); await inp.press('Enter'); await p.waitForTimeout(200);
  await p.click('#side .rel button[title="Ниже"] >> nth=0'); await p.waitForTimeout(200);
  const r = await p.evaluate(() => window.__rezets.S.doc.explode.steps.map((s) => [s.id, s.d]));
  console.log(JSON.stringify(r)); console.log('expect [[x2,80],[x1,120]]');
  console.log(logs.join('\n')); await b.close(); })();

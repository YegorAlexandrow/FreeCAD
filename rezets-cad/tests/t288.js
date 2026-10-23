// Slot option «Проставить размеры»: the centre distance and the width are dimensioned as it is made.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [] }); R.startSketch(R.PLANES.top); R.setTool('slot'); });
  await p.waitForTimeout(600); await p.click('#side .chk input'); const r = await p.evaluate(() => document.getElementById('cv').getBoundingClientRect());
  await p.mouse.click(r.left + 300, r.top + 300); await p.waitForTimeout(150); await p.mouse.click(r.left + 600, r.top + 300); await p.waitForTimeout(150); await p.mouse.click(r.left + 600, r.top + 340); await p.waitForTimeout(300);
  const out = await p.evaluate(() => { const S = window.__rezets.S; const sk = S.doc.features[0].sk; const es = Object.values(sk.ents); return { dims: Object.values(sk.cons).filter((c) => ['dist', 'diam'].includes(c.t)).map((c) => c.t + '=' + Math.round(c.v * 100) / 100), dof: S.analysis?.dofMain ?? S.analysis?.dof }; });
  console.log(JSON.stringify(out)); console.log('expect dims dist and diam, dof 2 (a horizontal slot has 4 without them)');
  console.log(logs.join('\n')); await b.close(); })();

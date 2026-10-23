// Rectangle option «Вспомогательные диагонали»: two construction lines corner to corner, no new freedom.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [] }); R.startSketch(R.PLANES.top); R.setTool('rect'); });
  await p.waitForTimeout(600); await p.click('#side .chk input'); const r = await p.evaluate(() => document.getElementById('cv').getBoundingClientRect());
  await p.mouse.click(r.left + 300, r.top + 250); await p.waitForTimeout(150); await p.mouse.click(r.left + 600, r.top + 450); await p.waitForTimeout(300);
  const out = await p.evaluate(() => { const S = window.__rezets.S; const sk = S.doc.features[0].sk; const es = Object.values(sk.ents); return { lines: es.filter((e) => e.t === 'line' && !e.constr).length, diag: es.filter((e) => e.constr).length, dof: S.analysis?.dofMain ?? S.analysis?.dof }; });
  console.log(JSON.stringify(out)); console.log('expect lines 4, diag 2, dof 4 (as a plain rectangle)');
  console.log(logs.join('\n')); await b.close(); })();

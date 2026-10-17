// Fillets put with the sketch fillet tool take a new radius typed in the tool's field afterwards, like SolidWorks.
const open = require('./harness.js'); const fs = require('fs');
const sk0 = JSON.parse(fs.readFileSync(__dirname + '/../testdata/gear_sketch3.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  const pts = await p.evaluate((sk0) => { const R = window.__rezets; const S = R.S;
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [{ id: 'f6', type: 'sketch', name: 'Эскиз3', plane: R.PLANES.top, sk: sk0 }] });
    R.editFeature(S.doc.features[0]); R.setTool('sfillet'); S.toolOpt.filletR = 1;
    const f = S.doc.features[0]; const r = document.getElementById('cv').getBoundingClientRect();
    return [[-2.2, 14.25], [2.2, 14.25]].map(([u, v]) => { const s = R.toScreen(R.toWorld(f.plane, u, v)); return [r.left + s.x, r.top + s.y]; }); }, sk0);
  await p.waitForTimeout(800); await p.mouse.move((pts[0][0] + pts[1][0]) / 2, pts[0][1]); for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, -400); await p.waitForTimeout(50); } await p.waitForTimeout(300);
  const pts2 = await p.evaluate(() => { const R = window.__rezets; const f = R.S.doc.features[0]; const r = document.getElementById('cv').getBoundingClientRect(); return [[-2.2, 14.25], [2.2, 14.25]].map(([u, v]) => { const s = R.toScreen(R.toWorld(f.plane, u, v)); return [r.left + s.x, r.top + s.y]; }); });
  for (const [x, y] of pts2) { await p.mouse.click(x, y); await p.waitForTimeout(200); }
  await p.fill('#opFillet', '0,8'); await p.press('#opFillet', 'Tab'); await p.waitForTimeout(300);
  console.log(JSON.stringify(await p.evaluate(() => { const S = window.__rezets.S; const sk = S.doc.features[0].sk; return { made: S.toolFillets.length, radii: S.toolFillets.map((id) => +sk.ents[id].r.toFixed(3)), note: document.querySelector('#side .grp .note')?.textContent }; })));
  console.log('expect made 2, radii [0.8, 0.8]');
  console.log(logs.join('\n')); await b.close(); })();

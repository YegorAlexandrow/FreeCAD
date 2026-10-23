// Linear pattern: once the direction is clicked on an edge, the step field has the focus for typing.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.S.selectedTree = 'feat:' + R.S.doc.features.find((f) => f.type === 'extrude' && f.mode === 'cut').id; R.cmdPattern('lpattern'); R.S.pm.pickFor = 'dir'; R.renderSide(); });
  await p.waitForTimeout(300);
  const at = await p.evaluate(() => { const R = window.__rezets; const r = document.getElementById('cv').getBoundingClientRect(); for (let y = r.top + 60; y < r.bottom - 40; y += 6) for (let x = r.left + 60; x < r.right - 60; x += 6) { const e = R.pickEdge({ clientX: x, clientY: y }, R.S.pm.topo, true); if (e?.edge?.t === 'line' && e.pd < 2) return [x, y]; } return null; });
  await p.mouse.click(at[0], at[1]); await p.waitForTimeout(300);
  const r = await p.evaluate(() => ({ dir: !!window.__rezets.S.pm.feature.dir?.edge, focus: document.activeElement?.id }));
  console.log(JSON.stringify(r)); console.log('expect dir true, focus pmStep');
  console.log(logs.join('\n')); await b.close(); })();

// Edges selected before the command: click one edge of the sample part, Ctrl+click another, then «Скругление» —
// the fillet starts with both edges.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800); await p.click('[data-view="iso"]'); await p.keyboard.press('f'); await p.waitForTimeout(600);
  const pts = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const T = R.edgeTopology(S.body, S.cyls); const r = document.getElementById('cv').getBoundingClientRect(); const out = [];
    for (const [a, b2] of T.lines) { const m = a.clone().lerp(b2, 0.5); const s2 = R.toScreen(m); const ev = { clientX: r.left + s2.x, clientY: r.top + s2.y }; const e = R.pickEdge(ev, T, true); if (e && e.pd < 2 && e.edge.t === 'line') out.push([ev.clientX, ev.clientY]); if (out.length === 2) break; } return out; });
  await p.mouse.click(...pts[0]); await p.keyboard.down('Control'); await p.mouse.click(...pts[1]); await p.keyboard.up('Control'); await p.waitForTimeout(200);
  const sel = await p.evaluate(() => window.__rezets.S.selEdges.length);
  await p.click('button.tool:has-text("Скругление")'); await p.waitForTimeout(800);
  const edges = await p.evaluate(() => window.__rezets.S.pm?.feature?.edges?.length);
  console.log(JSON.stringify({ sel, edges })); console.log('expect sel 2, edges 2');
  console.log(logs.join('\n')); await b.close(); })();

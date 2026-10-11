const open = require('./harness.js');
(async () => {
  const { b, p } = await open();
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; R.cmdMeasure(); const T = R.bodyTopo();
    const c = T.circles.find(c => Math.abs(c.r - 12) < 1e-6 && c.c.y > 30);
    // a top-face pick, constructed like measurePick does
    return { M: S.measure && 1, picks: S.measure ? 0 : -1, verts: T.verts.length, sample: T.verts.slice(0, 6).map(v => v.toArray().map(x => +x.toFixed(3))), bore: c && c.c.toArray() };
  });
  console.log(JSON.stringify(r));
  // simulate clicks at known world points through the real picking
  const box = await (await p.$('#cv')).boundingBox();
  const W = (x, y, z) => p.evaluate(([x, y, z]) => { const R = window.__rezets; return R.toScreen(R.toWorld({ o: [x, y, z], x: [1, 0, 0], y: [0, 1, 0] }, 0, 0)); }, [x, y, z]);
  for (const pt of [[0, 32, 0], [30, 12, 10]]) { const s = await W(...pt); await p.mouse.move(box.x + s.x, box.y + s.y); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(150); }
  const m = await p.evaluate(() => { const M = window.__rezets.S.measure; return M.picks.map(x => ({ k: x.kind, p: x.p.toArray().map(v => +v.toFixed(3)), n: x.n && x.n.toArray(), d: x.d })).concat([M.result.main]); });
  console.log(JSON.stringify(m)); await b.close();
})();

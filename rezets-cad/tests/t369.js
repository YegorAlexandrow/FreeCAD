// S0-32: a click on a model edge in a sketch brings it in only to be selected; a click elsewhere (or leaving the
// sketch) takes it away again unless something holds on to it, so misclicks leave nothing behind. One with a
// dimension on it stays.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1200);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const f = S.doc.features.find((x) => x.type === 'extrude'); R.sketchOnPlane({ ...R.PLANES.front, o: [0, 0, 0] }); });
  await p.waitForTimeout(800);
  const st = () => p.evaluate(() => { const sk = window.__rezets.S.doc.features.find((f) => f.id === window.__rezets.S.editing)?.sk; return sk ? { ext: Object.values(sk.ents).filter((e) => e.ext).length, pts: Object.keys(sk.pts).length } : null; });
  const refs = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const cv = document.getElementById('cv').getBoundingClientRect(); const f = S.doc.features.find((x) => x.id === S.editing); const L = S.refs.lines.slice(0, 2);
    return L.map(([x1, y1, x2, y2]) => { const s = R.toScreen(R.toWorld(f.plane, (x1 + x2) / 2, (y1 + y2) / 2)); return [cv.left + s.x, cv.top + s.y]; }); });
  await p.mouse.click(...refs[0]); await p.waitForTimeout(150); const a = await st();
  await p.mouse.click(...refs[1]); await p.waitForTimeout(150); const b2 = await st();
  const box = await (await p.$('#cv')).boundingBox(); await p.mouse.click(box.x + 30, box.y + 30); await p.waitForTimeout(150); const c = await st();
  await p.mouse.click(...refs[0]); await p.waitForTimeout(150);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = S.doc.features.find((f) => f.id === S.editing).sk; const k = [...S.sel][0].slice(2); const e = sk.ents[k]; sk.cons.dd = { id: 'dd', t: 'dist', refs: [e.p1, e.p2], v: 1, driven: true }; sk.pts.q1 = { id: 'q1', x: 1, y: 1 }; sk.pts.q2 = { id: 'q2', x: 5, y: 1 }; sk.ents.L1 = { id: 'L1', t: 'line', p1: 'q1', p2: 'q2' }; });
  await p.mouse.click(box.x + 30, box.y + 30); await p.waitForTimeout(150);
  const d = await st(); const fid = await p.evaluate(() => window.__rezets.S.editing); await p.evaluate(() => window.__rezets.exitSketch()); const e = await p.evaluate((fid) => { const S = window.__rezets.S; const f = S.doc.features.find((x) => x.id === fid); return { ext: Object.values(f.sk.ents).filter((x) => x.ext).length, dims: Object.keys(f.sk.cons).length }; }, fid);
  console.log(JSON.stringify({ a, b: b2, c, d, e })); console.log('expect a ext 1; b ext 1 (the first went when the second was picked); c ext 0; d ext 0 (the dimension holds the two corners, not the line); e ext 0, dims 1');
  console.log(logs.join('\n')); await b.close(); })();

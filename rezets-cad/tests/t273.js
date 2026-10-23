// G46: hover/selection highlights take the section's clipping plane. G47: an edge on the cut-away half is not picked.
// G48: the section belongs to its document: another part opens uncut, and coming back restores the cut.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(async () => { const R = window.__rezets; const S = R.S;
    const box = (w) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(-w, -w), P(w, -w), P(w, w), P(-w, w)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
      return { name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 20, dir: 1, regions: null }] }; };
    R.loadDoc(box(30)); const a = S.project.active; R.toggleSection(); const secA = JSON.stringify(S.section);
    R.showFeatureFaces && R.showFeatureFaces('f2'); await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
    let clipped = 0, total = 0; for (const g of [R.groups.hover]) g.traverse((o) => { if (o.material) { total++; if (o.material.clippingPlanes?.length) clipped++; } });
    R.addDoc('part', 'Деталь2', box(10)); const inB = { section: S.section, bar: document.getElementById('sectionBar').hidden };
    R.switchDoc(a); const back = JSON.stringify(S.section);
    return { secA, inB, back, same: secA === back, hover: [clipped, total] }; });
  console.log(JSON.stringify(r)); console.log('expect inB.section null, bar hidden true, same true; hover all clipped when any shown');
  // G47: front view of the cut box: the edge on the cut-away front face is not picked.
  await p.mouse.move(700, 450); await p.keyboard.press('Control+1'); await p.waitForTimeout(700);
  const e = await p.evaluate(() => { const R = window.__rezets; const S = R.S; S.body.computeBoundingBox(); const V = (x, y, z) => S.body.boundingBox.min.clone().set(x, y, z);
    const c = document.querySelector('canvas').getBoundingClientRect(); const s = R.toScreen(V(0, 20, 30));
    const ed = R.pickEdge({ clientX: c.left + s.x, clientY: c.top + s.y }, R.edgeTopology(S.body)); return ed && ed.t === 'line' ? [ed.a[2], ed.b[2]] : ed; });
  console.log('G47', JSON.stringify(e), 'expect z -30 (the back edge behind the cut), not 30 (the cut-away front edge)');
  console.log(logs.join('\n')); await b.close(); })();

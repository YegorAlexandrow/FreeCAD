// A15: in an isometric view a click on an edge hidden behind the block does not pick that edge.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(-20, -10), P(20, -10), P(20, 10), P(-20, 10)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Б', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null }] }); });
  await p.click('[data-view="iso"]'); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const T = R.edgeTopology(S.body, S.cyls); const r = document.getElementById('cv').getBoundingClientRect();
    const mids = T.lines.map(([a, c]) => ({ a, c, m: a.clone().lerp(c, 0.5) })).map((e) => ({ ...e, s: R.toScreen(e.m) }));
    // the hidden ones: a ray from the eye to the midpoint meets the block first
    const cam = R.camInfo(); const eye = cam.slice(0, 3), tgt = cam.slice(3, 6); const d = tgt.map((v, i) => v - eye[i]); const L = Math.hypot(...d); const dir = d.map((v) => v / L);
    const hidden = mids.filter((e) => { const o = e.m.toArray().map((v, i) => v - dir[i] * 500); const h = R.castRay(o, dir)[0]; return h && h.distance < 500 - 0.01; })
      .filter((e) => mids.every((o) => o === e || Math.hypot(o.s.x - e.s.x, o.s.y - e.s.y) > 15));
    if (!hidden.length) return 'no hidden edge isolated';
    const e = hidden[0]; const got = R.pickEdge({ clientX: r.left + e.s.x, clientY: r.top + e.s.y }, T);
    const same = got && got.t === 'line' && Math.hypot(...got.a.map((v, i) => v - e.a.toArray()[i])) < 1e-6 && Math.hypot(...got.b.map((v, i) => v - e.c.toArray()[i])) < 1e-6;
    return { hidden: hidden.length, pickedHidden: !!same }; })));
  console.log('expect pickedHidden false');
  console.log(logs.join('\n')); await b.close(); })();

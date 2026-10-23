// N38: the rebuild cache stays bounded: a part of 50 features rebuilt after 6 edits of its first feature
// keeps at most 100 entries (twice the features), not 50 more per edit.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const mk = (x0, y0, w, h) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
      const q = [P(x0, y0), P(x0 + w, y0), P(x0 + w, y0 + h), P(x0, y0 + h)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); return sk; };
    const feats = [{ id: 's0', type: 'sketch', name: 'Э0', plane: R.PLANES.front, sk: mk(0, 0, 200, 20) }, { id: 'e0', type: 'extrude', name: 'Б0', sketch: 's0', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null }];
    for (let i = 1; i < 25; i++) feats.push({ id: 's' + i, type: 'sketch', name: 'Э' + i, plane: R.PLANES.front, sk: mk(i * 8 - 3, 8, 3, 3) }, { id: 'e' + i, type: 'extrude', name: 'В' + i, sketch: 's' + i, mode: 'cut', end: 'through', depth: 10, dir: 1, regions: null });
    R.loadDoc({ name: 'T', nid: 100, rollback: null, features: feats }); const sizes = [S.cache.size];
    for (let k = 0; k < 6; k++) { R.featById('e0').depth = 10 + k + 1; R.rebuild(); sizes.push(S.cache.size); }
    return { n: feats.length, sizes, err: JSON.stringify(S.errors) }; })));
  console.log('expect n 50, every size <= 100, no errors');
  console.log(logs.join('\n')); await b.close(); })();

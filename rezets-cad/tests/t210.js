// N9/N10/N2: a cut that splits the part and a boss that does not touch it are flagged as making several bodies;
// a 5 mm cube beside a 100 mm block is its own body, not a scrap of the big one.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const mk = (x0, y0, w, h) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
      const q = [P(x0, y0), P(x0 + w, y0), P(x0 + w, y0 + h), P(x0, y0 + h)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); return sk; };
    const X = (id, sk, mode, depth = 10, end = 'blind') => [{ id: 's' + id, type: 'sketch', name: 'Э' + id, plane: R.PLANES.front, sk }, { id: 'e' + id, type: 'extrude', name: 'В' + id, sketch: 's' + id, mode, end, depth, dir: 1, regions: null }];
    const block = X(1, mk(-20, -10, 40, 20), 'add');
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [...block] }); const one = S.warns.e1 || null;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [...block, ...X(2, mk(-2, -15, 4, 30), 'cut', 10, 'through')] }); const slot = S.warns.e2 || null;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [...block, ...X(3, mk(40, 0, 5, 5), 'add', 5)] }); const apart = S.warns.e3 || null; const n = R.splitBodies(S.body).map((x) => Math.round(x.vol));
    return { one, slot, apart, n }; })));
  console.log('expect one null; slot and apart «Деталь теперь из 2 отдельных тел»; n [8000, 125]');
  console.log(logs.join('\n')); await b.close(); })();

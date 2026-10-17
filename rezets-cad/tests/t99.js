// "Вытянуть" in an empty part goes into a sketch instead of refusing; closing a sketch with a closed contour opens the
// extrude; tools that need a body are greyed out until there is one; cancelling the plane pick forgets the extrude.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S;
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [] });
    const fillet = () => [...document.querySelectorAll('button.tool')].find((x) => x.textContent.startsWith('Скругление'))?.disabled;
    const out = { filletOffEmpty: fillet() };
    R.cmdFeature('extrude', 'add'); out.pm1 = S.pm?.kind;
    document.querySelector('.pm .ghost-btn').click(); out.forgot = S.afterSketch;
    R.cmdFeature('extrude', 'add'); R.startSketch({ ...R.PLANES.top }); out.editing = !!S.editing;
    const sk = S.doc.features.find((f) => f.id === S.editing).sk; const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(0, 0), P(10, 0), P(10, 10), P(0, 10)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
    R.exitSketch(); out.pm2 = S.pm?.kind; out.feat = S.pm?.feature?.type + '/' + S.pm?.feature?.mode;
    R.okPM(); out.body = !!S.body; out.filletOnBody = fillet();
    return out; })));
  console.log('expect fillet disabled, pickPlane, forgot null, editing, then feature extrude/add, body, fillet enabled');
  console.log(logs.join('\n')); await b.close(); })();

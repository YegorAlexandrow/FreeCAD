// The user's gear sketch with six R5 fillets made by v71 (their tangency was refused as redundant): on the next
// solve they become tangent ends; at R3 every fillet still touches its pin and the bore, the short way round.
const open = require('./harness.js'); const fs = require('fs');
const sk0 = JSON.parse(fs.readFileSync(__dirname + '/../testdata/gear_sketch3b.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((sk0) => { const R = window.__rezets; const S = R.S;
    R.loadDoc({ name: 'Т', nid: 200, rollback: null, features: [{ id: 'f6', type: 'sketch', name: 'Эскиз3', plane: R.PLANES.top, sk: sk0 }] });
    const f = S.doc.features[0]; R.editFeature(f); const sk = f.sk; const P = (id) => sk.pts[id] || { x: 0, y: 0 };
    const fil = Object.values(sk.ents).filter((e) => e.t === 'arc' && e.snap && Math.abs(e.r - 15) > 0.01);
    const check = () => fil.map((e) => { const c = P(e.c); const pins = ['3', '9', '11'].map((id) => Math.hypot(c.x - P(sk.ents[id].c).x, c.y - P(sk.ents[id].c).y) - (3.5 + e.r)); const a = P(e.p1), q = P(e.p2); let sw = Math.atan2(q.y - c.y, q.x - c.x) - Math.atan2(a.y - c.y, a.x - c.x); while (sw <= 0) sw += 2 * Math.PI;
      return [+Math.min(...pins.map(Math.abs)).toFixed(3), +(Math.hypot(c.x, c.y) - (15 - e.r)).toFixed(3), +(sw * 180 / Math.PI).toFixed(0)]; });
    R.solveSketch(sk); const r5 = check(); const tan = Object.values(sk.cons).filter((k) => k.t === 'tanpt').length;
    R.setRadii(sk, fil, 3); const r3 = check(); const a = R.analyzeSketch(sk); return { tan, r5, r3, redundant: a.redundant.size }; }, sk0)));
  console.log('expect tan 12; every fillet [0, 0, < 180] at R5 and R3; redundant 0');
  console.log(logs.join('\n')); await b.close(); })();

// S0-26: Delete on a corner where two lines meet keeps both lines and takes away what is put on the corner (its
// relations and dimensions); a free end deleted still takes its line along, as before.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (k, x, y) => { sk.pts[k] = { id: k, x, y }; };
    P('a', 0, 0); P('k', 10, 0); P('c', 10, 10); P('z', 30, 0); P('w', 40, 0); sk.ents.A = { id: 'A', t: 'line', p1: 'a', p2: 'k' }; sk.ents.B = { id: 'B', t: 'line', p1: 'k', p2: 'c' }; sk.ents.Z = { id: 'Z', t: 'line', p1: 'z', p2: 'w' };
    sk.cons.d = { id: 'd', t: 'dist', refs: ['k', 'z'], v: 20, pos: [20, -5] }; sk.nid = 100;
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] }); R.editFeature(R.featById('f1'));
    R.S.sel = new Set(['p:k']); R.deleteSelection(); const s1 = { ents: Object.keys(sk.ents).sort().join(), cons: Object.keys(sk.cons).length };
    R.S.sel = new Set(['p:w']); R.deleteSelection(); return { s1, ents2: Object.keys(sk.ents).sort().join() }; });
  console.log(JSON.stringify(r)); console.log('expect s1 ents A,B,Z with cons 0 (the dimension on the corner gone); ents2 A,B');
  console.log(logs.join('\n')); await b.close(); })();

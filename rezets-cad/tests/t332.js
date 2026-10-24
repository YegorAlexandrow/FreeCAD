// A closed sketch on a face of the part, left with no feature on it, suggests a boss or a cut (A12); one on a
// standard plane suggests a boss or a revolve.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const R = window.__rezets; const S = R.S; R.loadDoc(R.sampleDoc()); R.rebuild(); const out = {};
    for (const [k, pl] of [['face', { ...R.PLANES.front, label: 'Грань' }], ['plane', { ...R.PLANES.front }]]) {
      R.startSketch(pl); const sk = R.featById(S.editing).sk; const P = [[0, 0], [10, 0], [10, 10], [0, 10]];
      P.forEach(([x, y], i) => { sk.pts['q' + i] = { id: 'q' + i, x, y }; }); P.forEach((_, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: 'q' + i, p2: 'q' + ((i + 1) % 4) }; });
      R.exitSketch(); out[k] = document.getElementById('hint').textContent; }
    return out; });
  console.log(JSON.stringify(r)); console.log('expect face …«Вырез» (X), plane …«Повернуть» (R), no final dot');
  console.log(logs.join('\n')); await b.close(); })();

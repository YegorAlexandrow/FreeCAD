// The user's Деталь 12 (a checkerboard of cells): every face of a cell stays flat on the shown body. v109 showed cells
// folded along a diagonal (the shown body was not the one the kernel built). Slanted triangles are allowed only on the
// round features of Вырез1, Бобышка5 and Вырез2 (y 14..40, z -40..-14).
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/checker-cells.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild();
    const g = S.body; const P = g.getAttribute('position'); const ix = g.index; const n = ix ? ix.count : P.count; const V = (i) => [P.getX(i), P.getY(i), P.getZ(i)];
    let folded = 0; for (let t = 0; t < n; t += 3) { const [a, b2, c] = [0, 1, 2].map((k) => V(ix ? ix.getX(t + k) : t + k)); const u = b2.map((v, i) => v - a[i]), w = c.map((v, i) => v - a[i]);
      const N = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]; const L = Math.hypot(...N); if (L < 1e-9) continue;
      const cut = [a, b2, c].every((q) => q[1] > 14 && q[1] < 40 && q[2] > -40 && q[2] < -14); if (!cut && Math.max(...N.map((v) => Math.abs(v / L))) < 0.9999) folded++; }
    return { tris: n / 3, folded }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect folded 0'); console.log(logs.join('\n')); await b.close(); })();

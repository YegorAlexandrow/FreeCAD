// A heavy organic STL (a torus of 400 000 triangles, every facet at a shallow angle to the next) imports without
// freezing the page: the curved surface stays one face, and the import finishes in reasonable time.
const open = require('./harness.js'); const fs = require('fs');
const SP = '/tmp/claude-0/-home-user/922fd1d6-a4fe-5bbc-a891-f41e1f96d977/scratchpad/torus.stl';
{ const U = 500, V = 400, R = 30, r = 8; const n = U * V * 2; const buf = Buffer.alloc(84 + 50 * n); buf.writeUInt32LE(n, 80); let o = 84;
  const P = (i, j) => { const u = i / U * 2 * Math.PI, v = j / V * 2 * Math.PI; return [(R + r * Math.cos(v)) * Math.cos(u), (R + r * Math.cos(v)) * Math.sin(u), r * Math.sin(v)]; };
  const tri = (a, b, c) => { o += 12; for (const q of [a, b, c]) for (const x of q) { buf.writeFloatLE(x, o); o += 4; } o += 2; };
  for (let i = 0; i < U; i++) for (let j = 0; j < V; j++) { const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1); tri(a, b, c); tri(a, c, d); }
  fs.writeFileSync(SP, buf); }
(async () => { const { b, p, logs } = await open();
  const t0 = Date.now(); await p.setInputFiles('#stepIn', SP); await p.waitForFunction(() => window.__rezets.S.mode === 'import', null, { timeout: 180000 });
  const t1 = Date.now();
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const d = R.activeEntry().data; return { faces: d.faces.length, tris: d.pos.length / 9, nrm: d.nrm }; })), 'seconds', ((t1 - t0) / 1000).toFixed(1));
  const t2 = Date.now(); const ok = await p.evaluate(() => 1 + 1); console.log('responsive', ok === 2, ((Date.now() - t2) / 1000).toFixed(1), 's');
  console.log('expect 1 face (or a few), 400000 tris, nrm null, import in well under a minute, responsive');
  console.log(logs.join('\n')); await b.close(); })();

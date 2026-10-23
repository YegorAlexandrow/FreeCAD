// STL reading: a binary file with padding bytes after the last triangle opens; upper-case ASCII opens; empty and cut
// files say what is wrong; the exported file is Z-up (a part on «Сверху» stands on the bed).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const o = {};
    const bin = R.stlBinary(R.S.body); const pad = new Uint8Array(bin.length + 2); pad.set(bin); o.padded = R.parseStl(pad).length / 9;
    const txt = new TextEncoder().encode('SOLID X\nFACET NORMAL 0 0 1\n OUTER LOOP\n  VERTEX 0 0 0\n  VERTEX 1 0 0\n  VERTEX 0 1 0\n ENDLOOP\nENDFACET\nENDSOLID'); o.upper = R.parseStl(txt).length / 9;
    const err = (u8) => { try { R.parseStl(u8); return 'ok'; } catch (e) { return e.message; } };
    o.empty = err(new Uint8Array(0)); o.cut = err(bin.subarray(0, 84 + 50 * 3 + 10));
    const t = R.parseStl(bin); let zmin = Infinity, zmax = -Infinity, ymin = Infinity, ymax = -Infinity; for (let i = 0; i < t.length; i += 3) { zmin = Math.min(zmin, t[i + 2]); zmax = Math.max(zmax, t[i + 2]); ymin = Math.min(ymin, t[i + 1]); ymax = Math.max(ymax, t[i + 1]); }
    R.S.body.computeBoundingBox(); const bb = R.S.body.boundingBox; o.model = [+bb.min.y.toFixed(1), +bb.max.y.toFixed(1)]; o.fileZ = [+zmin.toFixed(1), +zmax.toFixed(1)]; return o; })));
  console.log('expect padded = triangles, upper 1, empty «файл пустой», cut «файл обрезан…», fileZ equals model Y range');
  console.log(logs.join('\n')); await b.close(); })();

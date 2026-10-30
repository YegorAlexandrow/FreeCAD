// A reference to the model names the operation and the face of it that made it (an extrusion's start or end, the side
// of a line of its sketch) and is worked out from the sketch and the depth, not searched for on the mesh. ARM1: Эскиз7
// lies on the end of Вырез1 (symmetric, 33 mm), below a switched off Бобышка3; below a switched off feature nothing was
// followed at all, and a deeper cut left the sketch inside the part. ARM3 v2: a sketch on the side of the lever (one
// face with the side of the groove next to it) stays with the lever when the groove's line moves away.
const open = require('./harness.js'); const fs = require('fs');
const arm1 = JSON.parse(fs.readFileSync(__dirname + '/data/arm1.json', 'utf8'));
const arm3 = JSON.parse(fs.readFileSync(__dirname + '/data/arm3-v2-now.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(([arm1, arm3]) => { const R = window.__rezets; const S = R.S; const F = (n) => S.doc.features.find((x) => x.name === n);
    R.loadDoc(arm1); R.rebuild(); const z0 = F('Эскиз7').plane.o[2]; F('Вырез1').depth = 35; R.rebuild(); const z1 = F('Эскиз7').plane.o[2]; F('Вырез1').depth = 33; R.rebuild(); const z2 = F('Эскиз7').plane.o[2];
    const out = { arm1: [z0, z1, z2].map((v) => +v.toFixed(4)) };
    R.loadDoc(arm3); R.rebuild(); const s9 = F('Эскиз9'); const x0 = F('Эскиз10').plane.o[0]; s9.sk.cons['18'].v += 0.5; R.solveSketch(s9.sk); R.rebuild();
    out.arm3 = { moved: +(F('Эскиз10').plane.o[0] - x0).toFixed(4), lost: [...S.dangling.keys()].map((k) => S.doc.features.find((x) => x.id === k)?.name).filter((n) => n === 'Эскиз10' || n === 'Эскиз11') };
    return out; }, [arm1, arm3]);
  console.log(JSON.stringify(r)); console.log('expect arm1 [16.5,17.5,16.5] (or the negatives), arm3 moved 0, lost []');
  console.log(logs.join('\n')); await b.close(); })();

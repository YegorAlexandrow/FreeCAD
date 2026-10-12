// Mates follow their faces when ARM2's extrude heights change (testdata/big/servo_proj7b.json, not in git):
// planes and axes are found again among the faces the same operation made, a vertex where its planes meet.
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/servo_proj7b.json', 'utf8');
(async () => { const { b, p, logs } = await open();
  console.log(await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d2'); const asm = R.S.doc; const out = [];
    out.push('refs ' + asm.mates.map((m) => m.name + ':' + [m.a, m.b].filter((r) => r.comp === 'c17').map((r) => r.kind + r.e + '<' + r.by + '>').join(',')).join(' '));
    for (const [fid, d] of [['f12', 16], ['f11', 10], ['f4', 4]]) {
      R.switchDoc('d7'); const f = R.S.doc.features.find((x) => x.id === fid); const old = f.depth; f.depth = d; R.rebuild(); R.switchDoc('d2');
      const an = R.S.asmAnalysis; out.push(fid + ' ' + old + '→' + d + ' broken ' + asm.mates.filter((m) => m.broken).map((m) => m.name) + ' bad ' + [...an.redundant].map((id) => asm.mates.find((m) => m.id === id).name) + ' dof ' + an.dof);
    }
    return out.join('\n'); }, proj));
  console.log('expect refs with creators (f4, f11, f12), and after each height change no broken, no bad, dof 1');
  console.log(logs.join('\n')); await b.close(); })();

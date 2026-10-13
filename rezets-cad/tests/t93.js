// Concentric on a fork: ARM2's two end rings share one axis. The ring clicked decides where ARM3 goes along
// it (the user's assembly, testdata/big/servo_proj10.json, not in git).
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/servo_proj10.json', 'utf8');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d2'); const asm = R.S.doc; const out = {};
    const m0 = asm.mates.find((x) => x.name === 'Концентричность5'); asm.mates = asm.mates.filter((x) => x !== m0); const c34 = asm.comps.find((c) => c.id === 'c34'), c17 = asm.comps.find((c) => c.id === 'c17');
    const before = c34.T.slice();
    for (const [name, z] of [['upper', 1.5], ['lower', -28.5]]) { c34.T = before.slice(); const m = JSON.parse(JSON.stringify(m0)); m.id = 'mt' + name; m.a.at = [131, 0, z];
      const r = R.tryAddMate(asm, m);
      const T = R.poseOf(c34); const ref = R.axialMid(m.b, c34).applyQuaternion(T.q).add(T.t); const loc = ref.clone().sub(R.poseOf(c17).t).applyQuaternion(R.poseOf(c17).q.clone().invert());
      out[name] = { status: r.status, z: +loc.z.toFixed(2) }; asm.mates = asm.mates.filter((x) => x.id !== m.id); }
    return out; }, proj)));
  console.log('expect upper z about 0.5 (at the top ring, z 0..3), lower about -27.5 (at the bottom ring, z -30..-27): the centres of the two picked faces meet');
  console.log(logs.join('\n')); await b.close(); })();

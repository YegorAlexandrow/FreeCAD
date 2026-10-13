// Face mates on the user's assembly (testdata/big/servo_proj10.json, not in git): ARM3 already concentric with
// ARM2's end rings; a coincident between ARM2's upper face (z = 3) and any of ARM3's end faces is accepted,
// the other alignment taken when the concentric fixes the orientation, and ARM3 lands at that face.
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/servo_proj10.json', 'utf8');
(async () => { const { b, p, logs } = await open();
  console.log(await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d2'); const asm = R.S.doc; const out = [];
    const c17 = asm.comps.find((c) => c.id === 'c17'), c34 = asm.comps.find((c) => c.id === 'c34'); const arm = R.docInfo('d7'), a3 = R.docInfo('d9');
    const planesNear = (inf, test) => inf.ents.map((e, i) => [e, i]).filter(([e]) => e.kind === 'plane' && test(e));
    const up = planesNear(arm, (e) => Math.abs(Math.abs(e.n.z) - 1) < 1e-6); out.push('ARM2 z-planes ' + up.map(([e, i]) => i + ':n' + e.n.z + ' d' + e.n.dot(e.p).toFixed(2)).join(' '));
    const ap = planesNear(a3, (e) => Math.abs(Math.abs(e.n.z) - 1) < 1e-6); out.push('ARM3 z-planes ' + ap.map(([e, i]) => i + ':n' + e.n.z + ' d' + e.n.dot(e.p).toFixed(2)).join(' '));
    const ref = (c, inf, i, at) => { const e = inf.ents[i]; return { comp: c.id, kind: 'plane', p: e.p.toArray(), d: e.n.toArray(), e: i, at }; };
    // upper face of ARM2's top plate (z = 3) at the ring, against each ARM3 z-face
    const topI = up.find(([e]) => e.n.z > 0 && Math.abs(e.n.dot(e.p) - 3) < 1e-3)[1];
    for (const [e, i] of ap) { const before = asm.comps.map((c) => [c.id, c.T.slice()]);
      R.cmdMate(); const pm = R.S.pm; pm.picks = [ref(c17, arm, topI, [126, 7, 3]), ref(c34, a3, i)]; pm.type = 'coincident'; R.previewMate(); const r = pm.result || {}; R.okPM(); const T = R.poseOf(c34), T17 = R.poseOf(c17); const loc = T.t.clone().sub(T17.t).applyQuaternion(T17.q.clone().invert());
      out.push('ARM3 face ' + i + ' → ' + r.status + ' ARM3 origin in ARM2 coords ' + loc.toArray().map((v) => v.toFixed(2)));
      if (r.status === 'ok') asm.mates.pop(); R.S.pm = null; for (const [id, TT] of before) asm.comps.find((c) => c.id === id).T = TT; }
    return out.join('\n'); }, proj));
  console.log('expect every ARM3 face ok (face 5 by the other alignment), ARM3 placed along z by the face it meets');
  console.log(logs.join('\n')); await b.close(); })();

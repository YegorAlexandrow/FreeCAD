// The user's ARM2 with both servos (testdata/big/servo_proj6.json, not in git): the second servo's
// repeated concentric mates leave 1e-8 remainders from the STEP axes; ARM2 must keep its turn.
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/servo_proj6.json', 'utf8');
(async () => {
  const { b, p, logs } = await open();
  const r = await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d2'); const asm = R.S.doc;
    const an = R.asmAnalyze(asm); const c = asm.comps.find((x) => x.id === 'c17'); const p0 = R.poseOf(c);
    const ax = R.worldEnt(asm.mates[0].a, p0); const u = ax.d.clone().cross(new p0.t.constructor(0.3, 0.5, 0.8)).normalize();
    const start = ax.p.clone().addScaledVector(u, 40); const T = start.clone().sub(ax.p).applyAxisAngle(ax.d, 0.4).add(ax.p);
    const ok = R.dragFollow(asm, c, { start, pose0: p0 }, T); const p1 = R.poseOf(c);
    return { dof: an.dof, free: [...an.free].sort().join(','), bad: an.redundant.size, drag: ok, turn: +(2 * Math.acos(Math.min(1, Math.abs(p1.q.dot(p0.q))))).toFixed(3), still: R.asmAnalyze(asm).redundant.size }; }, proj);
  console.log(JSON.stringify(r), '\nexpect dof 1, free c17,c21,c26, bad 0, drag true, turn 0.4, still 0');
  console.log(logs.join('\n')); await b.close();
})();

// The user's servo on ARM0 (testdata/big/arm0_asm.json, not in git): ARM0's holes are 28.5002 mm apart (float32
// sketch), the servo's 28.5; the second concentric mate is taken, the hole pair at 29.84 is still a conflict.
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/arm0_asm.json', 'utf8');
(async () => {
  const { b, p, logs } = await open();
  const r = await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d13'); const asm = R.S.doc;
    const sv = R.docInfo('d5'), arm = R.docInfo('d14'); const c1 = asm.comps.find((c) => c.id === 'c1'), c2 = asm.comps.find((c) => c.id === 'c2');
    const ref = (c, inf, i) => { const e = inf.ents[i]; return { comp: c.id, kind: 'axis', p: e.p.toArray(), d: e.d.toArray(), r: e.r, e: i }; };
    const hole = arm.ents.findIndex((e) => e.kind === 'axis' && Math.abs(e.p.x + 19.95) < 0.01); const sax = (x, z) => sv.ents.findIndex((e) => e.kind === 'axis' && Math.abs(e.r - 1) < 0.01 && Math.abs(e.p.x - x) < 0.01 && Math.abs(e.p.z - z) < 0.01);
    const out = {};
    R.cmdMate(); let pm = R.S.pm; pm.picks = [ref(c2, sv, sax(-15.25, 4.5)), ref(c1, arm, hole)]; pm.type = 'concentric'; R.previewMate(); out.wrong = pm.result?.status; R.S.pm = null;
    R.cmdMate(); pm = R.S.pm; pm.picks = [ref(c2, sv, sax(-14.25, 0)), ref(c1, arm, hole)]; pm.type = 'concentric'; R.previewMate(); out.right = pm.result?.status;
    R.okPM(); out.mates = asm.mates.length; out.bad = [...(R.S.asmAnalysis?.redundant || [])]; return out; }, proj);
  console.log(JSON.stringify(r), '\nexpect wrong conflict, right ok, 3 mates, none bad');
  console.log(logs.join('\n')); await b.close();
})();

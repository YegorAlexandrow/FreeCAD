// The user's servo on ARM2 (testdata/big/servo_proj5.json, not in git): a second hole pair with a
// different spacing is explained and the hole at the right spacing is offered; taking it works.
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/servo_proj5.json', 'utf8');
(async () => {
  const { b, p, logs } = await open();
  const r = await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d2'); const asm = R.S.doc;
    const sv = R.docInfo('d5'), arm = R.docInfo('d7'); const c17 = asm.comps.find((c) => c.id === 'c17'), c21 = asm.comps.find((c) => c.id === 'c21');
    const ref = (c, inf, i) => { const e = inf.ents[i]; return { comp: c.id, kind: 'axis', p: e.p.toArray(), d: e.d.toArray(), r: e.r, e: i }; };
    R.cmdMate(); const pm = R.S.pm; pm.picks = [ref(c21, sv, 45), ref(c17, arm, 9)]; pm.type = 'concentric'; R.previewMate();
    const out = { status: pm.result?.status, why: pm.result?.why, suggest: pm.suggest?.e };
    const btn = [...document.querySelectorAll('#side .chip')].find((x) => x.textContent === 'Взять подсвеченную'); out.button = !!btn; btn?.click();
    out.after = R.S.pm.result?.status; R.okPM(); out.mates = asm.mates.length; out.dof = R.S.asmAnalysis.dof; return out; }, proj);
  console.log(JSON.stringify(r, null, 1), '\nexpect conflict explained (29.84 vs 28.5), suggest servo axis 48, after ok, 5 mates, dof 6 (only the second servo free)');
  console.log(logs.join('\n')); await b.close();
})();

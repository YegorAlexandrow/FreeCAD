// Editing a broken mate: the reference the part lost is dropped from the picks and the panel says which one to pick
// again (the user's servo assembly with an older ARM2, testdata/big/servo_proj7.json, not in git).
const open = require('./harness.js'); const fs = require('fs');
(async () => { const { b, p, logs } = await open();
  const proj = fs.readFileSync(__dirname + '/../testdata/big/servo_proj7.json', 'utf8');
  const r = await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d2'); const asm = R.S.doc;
    const m = asm.mates.find((x) => x.broken); const lost = [m.a.lost, m.b.lost]; R.editMate(m); R.renderSide();
    return { name: m.name, lost, picks: R.S.pm.picks.length, note: document.querySelector('#side .pm .note')?.textContent }; }, proj);
  console.log(JSON.stringify(r)); console.log('expect one of lost true, picks 1, note naming the lost reference and its component');
  console.log(logs.join('\n')); await b.close(); })();

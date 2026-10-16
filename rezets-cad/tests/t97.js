// Holes opened up for a fit keep their concentric mates: the user's ARM2 with the servo holes changed from ⌀1 to ⌀1.8
// and ⌀2 to ⌀2.2 (testdata/big/servo_proj11.json, not in git).
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/servo_proj11.json', 'utf8');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d2'); const asm = R.S.doc;
    return { broken: asm.mates.filter((m) => m.broken).map((m) => m.name), bad: [...R.S.asmAnalysis.redundant].length, dof: R.S.asmAnalysis.dof }; }, proj)));
  console.log('expect no broken mates, none unsatisfied');
  console.log(logs.join('\n')); await b.close(); })();

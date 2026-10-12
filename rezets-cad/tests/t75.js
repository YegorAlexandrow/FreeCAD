// Mates whose faces are gone after a part edit are marked broken: the user's servo assembly with an
// older ARM2's mates (testdata/big/servo_proj7.json, not in git) and the re-mated version (7b).
const open = require('./harness.js'); const fs = require('fs');
(async () => {
  const { b, p, logs } = await open();
  for (const f of ['servo_proj7', 'servo_proj7b']) {
    const proj = fs.readFileSync(__dirname + '/../testdata/big/' + f + '.json', 'utf8');
    console.log(f, JSON.stringify(await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d2'); const asm = R.S.doc;
      return { dof: R.S.asmAnalysis.dof, broken: asm.mates.filter((m) => m.broken).map((m) => m.name).join(','), marks: [...document.querySelectorAll('#side .row.err b')].filter((x) => x.textContent === '!').length, note: !!document.querySelector('#side .note') }; }, proj)));
  }
  console.log('expect proj7 broken Совпадение3,Концентричность2,Концентричность3 with 3 marks, a note, dof 7 (second servo free); proj7b none, dof 1');
  console.log(logs.join('\n')); await b.close();
})();

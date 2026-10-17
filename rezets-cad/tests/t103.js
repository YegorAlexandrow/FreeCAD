// A component picked, then a mate clicked in the tree: Delete removes the mate, not the component.
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/arm0_asm.json', 'utf8');
(async () => {
  const { b, p, logs } = await open();
  await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d13'); R.S.asmSel = 'c2'; R.asmRefresh();
    [...document.querySelectorAll('#side .row')].find((x) => x.textContent.includes('Концентричность1')).click(); }, proj);
  await p.mouse.move(700, 400); await p.keyboard.press('Delete');
  console.log(JSON.stringify(await p.evaluate(() => { const asm = window.__rezets.S.doc; return { comps: asm.comps.length, mates: asm.mates.map((m) => m.name) }; })), '\nexpect comps 3, mates [Совпадение1]');
  console.log(logs.join('\n')); await b.close();
})();

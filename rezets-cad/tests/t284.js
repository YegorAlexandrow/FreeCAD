// A component in the assembly tree opens onto its own mates; a click on one selects that mate.
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/arm0_asm.json', 'utf8');
(async () => { const { b, p, logs } = await open();
  await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); const a = R.S.project.docs.find((d) => d.kind === 'asm'); R.switchDoc(a.id); }, proj);
  await p.waitForTimeout(800);
  const n0 = await p.evaluate(() => document.querySelectorAll('#side .row.child').length);
  await p.click('#side .row .tw:not(:empty) >> nth=0'); await p.waitForTimeout(300);
  const kids = await p.evaluate(() => [...document.querySelectorAll('#side .row.child')].map((x) => x.textContent));
  await p.click('#side .row.child >> nth=0'); await p.waitForTimeout(300); const sel = await p.evaluate(() => [window.__rezets.S.mateSel, document.querySelector('#side .row.child.sel')?.textContent]);
  console.log(JSON.stringify({ n0, kids, sel })); console.log('expect n0 0; kids the mates of the first component with the other part named; sel that mate selected');
  console.log(logs.join('\n')); await b.close(); })();

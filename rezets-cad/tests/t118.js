// A component can be hidden in the assembly: not drawn or picked, its mates and BOM line kept; shown again.
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/arm0_asm.json', 'utf8');
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d13'); const S = R.S; const asm = S.doc;
    const drawn = () => R.asmGroup ? R.asmGroup.children.length : document.querySelectorAll('#side .row.off').length;
    const out = { drawn0: R.asmGroup.children.length };
    const c2 = asm.comps.find((c) => c.id === 'c2'); [...document.querySelectorAll('#side .row')].find((x) => x.textContent.includes('SC09'))?.querySelector('.eye')?.click();
    out.hidden = !!c2.hidden; out.offRows = document.querySelectorAll('#side .row.off').length; out.mates = asm.mates.length; out.drawn = R.asmGroup.children.length;
    R.toggleCompHidden(c2); out.shown = !c2.hidden; out.drawn2 = R.asmGroup.children.length; return out; }, proj)));
  console.log('expect drawn0 2 (ARM1 is not in this test project), hidden true, drawn 1, 1 off row, mates 2, shown true, drawn2 2');
  console.log(logs.join('\n')); await b.close(); })();

// F16: a change that leaves a later sketch hanging is said at once, with a button to it: Деталь 12, Бобышка8 switched
// off takes away the side Эскиз14 lies on and the corners it is tied to. Loading the part says nothing.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/part12-sketch14.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild(); const F = (id) => S.doc.features.find((x) => x.id === id);
    const quiet = [...document.querySelectorAll('.toast')].map((e) => e.textContent).filter((t) => t.startsWith('После правки'));
    // Suppress Бобышка8: Эскиз14 lies on its side and takes its corners from it.
    F('f36').suppressed = true; R.rebuild();
    const said = [...document.querySelectorAll('.toast')].map((e) => e.textContent).filter((t) => t.startsWith('После правки'));
    return { quiet: quiet.length, said }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect quiet 0; said one toast naming Эскиз14, with «Открыть»');
  console.log(logs.join('\n')); await b.close(); })();

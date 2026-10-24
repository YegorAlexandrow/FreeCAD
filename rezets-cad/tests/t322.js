// A boss that does not build shows, under its error, a button that opens its sketch (A39).
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(async () => { const R = window.__rezets; const S = R.S; R.loadDoc(R.sampleDoc()); const f = S.doc.features.find((x) => x.type === 'extrude'); const sk = R.featById(f.sketch);
    sk.sk.ents = {}; sk.sk.cons = {}; R.rebuild(); R.editFeature(f); await new Promise((r) => setTimeout(r, 100));
    const box = document.querySelector('.pm .pm-errbox'); const btn = box && [...box.querySelectorAll('button')].find((x) => x.textContent.includes(sk.name));
    const out = { err: box?.querySelector('.note')?.textContent || null, btn: btn?.textContent || null }; btn?.click(); await new Promise((r) => setTimeout(r, 300));
    return { ...out, editing: S.editing === sk.id, pm: !!S.pm }; });
  console.log(JSON.stringify(r)); console.log('expect err about the sketch, btn «Открыть «Эскиз…»», editing true, pm false after the click');
  console.log(logs.join('\n')); await b.close(); })();

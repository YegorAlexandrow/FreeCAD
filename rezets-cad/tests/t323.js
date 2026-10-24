// Opening a feature that is under the rollback bar moves the bar to just under it (A24), so the panel edits a built feature.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(async () => { const R = window.__rezets; const S = R.S; R.loadDoc(R.sampleDoc()); R.rebuild();
    const fs = S.doc.features; const ex = fs.filter((f) => f.type !== 'sketch'); const first = ex[0], last = ex.at(-1);
    S.doc.rollback = fs.indexOf(first) + 1; R.rebuild(); const mid = ex[1]; R.editFeature(mid); await new Promise((r) => setTimeout(r, 100));
    const out = { rollback: S.doc.rollback, want: fs.indexOf(mid) + 1, pm: S.pm?.feature?.id === mid.id, toast: [...document.querySelectorAll('.toast')].map((t) => t.textContent).at(-1) };
    R.okPM?.(); return out; });
  console.log(JSON.stringify(r)); console.log('expect rollback = want (or null when it is the last), pm true, toast «Откат перенесён под «…»»');
  console.log(logs.join('\n')); await b.close(); })();

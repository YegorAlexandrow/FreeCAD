// Dragging a chamfer above the feature whose edge it is on (the user's ARM2, Фаска2 on a hole's rim) is taken back:
// the tree stays exactly as it was and a message names what would not build. Moving a feature where it still builds
// works as before.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/arm2-chamfer.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild();
    const j0 = JSON.stringify(S.doc.features); const ch = S.doc.features.find((f) => f.name === 'Фаска2'); const first = S.doc.features.find((f) => f.type !== 'sketch');
    const moved = R.moveFeature(ch.id, S.doc.features[S.doc.features.indexOf(first) + 1].id);
    const toast = [...document.querySelectorAll('.toast')].map((t) => t.textContent).join(' | ');
    const same = JSON.stringify(S.doc.features) === j0; const errs = Object.keys(S.errors).filter((k) => S.errors[k]).length;
    const last = S.doc.features.at(-1); const okMove = last.id !== ch.id && R.moveFeature(ch.id, null); return { moved, same, errs, toast: toast.slice(0, 200), okMove, at: S.doc.features.at(-1).name }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect moved false, same true, toast «Перенос «Фаска2» отменён: …», okMove true, at Фаска2');
  console.log(logs.join('\n')); await b.close(); })();

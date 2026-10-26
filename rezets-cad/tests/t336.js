// A part saved without its id counter (the user's ARM3 v2: two features got «fNaN», then «f0», and the counter stood at
// 2, below the features) is repaired when opened: ids unique, the cut keeps its own sketch, and a new feature gets a free id.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/arm3-fnan.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(async (doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); R.rebuild();
    const ids = S.doc.features.map((f) => f.id); const cut = S.doc.features.find((f) => f.name === 'Вырез1'); const cutSk = R.featById(cut.sketch)?.name;
    const sk12 = S.doc.features.find((f) => f.name === 'Эскиз12'); S.selectedTree = 'feat:' + sk12.id; R.cmdFeature('extrude', 'cut'); await new Promise((r) => setTimeout(r, 300)); const f = S.pm?.feature; if (f) { f.end = 'through'; } R.okPM(); await new Promise((r) => setTimeout(r, 300));
    const last = S.doc.features.at(-1); const errs = Object.entries(S.errors).filter(([k, e]) => e && S.doc.features.some((x) => x.id === k)).map(([k, e]) => R.featById(k).name + ': ' + e);
    return { unique: new Set(S.doc.features.map((x) => x.id)).size === S.doc.features.length, bad: ids.filter((id) => !/^f\d+$/.test(id)), nid: S.doc.nid, cutSk, last: [last.name, last.type, last.mode, R.featById(last.sketch)?.name], errs }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect unique true, bad [], nid above every id, cutSk Эскиз11, last a cut on Эскиз12, errs []');
  console.log(logs.join('\n')); await b.close(); })();

// The user's BASE Эскиз6: a linear pattern of 8 copies of a hinge outline (lines and arcs). Copied arcs no longer
// repeat their radius (it was shown as overdefined, two red relations per arc); the pattern's own relations have
// no glyphs. Making a new pattern: typing the count updates the preview before OK.
const open = require('./harness.js'); const fs = require('fs');
(async () => { const { b, p, logs } = await open();
  const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/base_d30.json', 'utf8')).data;
  const out = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); const f = S.doc.features.find((x) => x.id === 'f22'); R.editFeature(f);
    const a = R.analyzeSketch(f.sk); return { dof: a.dof, redundant: a.redundant.size, glyphs: document.querySelectorAll('.glyph').length, err: JSON.stringify(S.errors) }; }, doc);
  // new pattern of the first source line, count typed as 5 without Enter
  out.preview = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const sk = R.featById(S.editing).sk; const src = Object.values(sk.ents).find((e) => !e.pat && !e.ext && e.t === 'line');
    S.sel.clear(); S.sel.add('e:' + src.id); R.cmdSkPattern(); return S.draw?.preview?.length; });
  const inp = p.locator('#side .grp', { has: p.locator('button', { hasText: 'OK' }) }).locator('label.field', { hasText: 'Количество' }).locator('input'); await inp.fill('5');
  out.typed = await p.evaluate(() => window.__rezets.S.draw?.preview?.length);
  out.notMade = await p.evaluate(() => Object.keys(window.__rezets.featById(window.__rezets.S.editing).sk.pats).length);
  await inp.press('Enter'); out.made = await p.evaluate(() => Object.keys(window.__rezets.featById(window.__rezets.S.editing).sk.pats).length);
  out.after = await p.evaluate(() => { const R = window.__rezets; const sk = R.featById(R.S.editing).sk; const a = R.analyzeSketch(sk); return { redundant: a.redundant.size }; });
  console.log(JSON.stringify(out));
  console.log('expect redundant 0, few glyphs (no pattern ones), no errors; preview 2 -> typed 4 segments, notMade 1, made 2, after redundant 0');
  console.log(logs.join('\n')); await b.close(); })();

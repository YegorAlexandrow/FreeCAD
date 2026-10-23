// «Дублировать» an imported model gives a working copy (its triangles survive the copy), independent of the original.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open();
  await p.setInputFiles('#stepIn', __dirname + '/../testdata/servo.step'); await p.waitForFunction(() => window.__rezets.S.mode === 'import', null, { timeout: 60000 }); await p.waitForTimeout(400);
  const out = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const src = R.activeEntry(); const n0 = src.data.pos.length;
    R.docMenuItems(src, 0, 0, null).find((it) => it && it[0] === 'Дублировать')[1]();
    const copy = S.project.docs[S.project.docs.length - 1]; R.switchDoc(copy.id); return { n0, n1: copy.data.pos.length, isTyped: copy.data.pos instanceof Float32Array, separate: copy.data.pos !== src.data.pos, body: !!S.body }; });
  console.log(JSON.stringify(out));
  console.log('expect n1 = n0, isTyped true, separate true, body true, no PAGEERROR');
  console.log(logs.join('\n')); await b.close(); })();

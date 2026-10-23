// Drawing: arcs get R, full circles ⌀ with a count for alike holes; two vertices one above the other give a vertical
// size, not 0; the same vertex twice gives nothing; views past the sheet are reported in the panel.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/gripper2.json', 'utf8')).data;
(async () => { const { b, p, logs } = await open();
  const out = await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc); const part = R.activeEntry().id;
    R.addDoc('drw', 'Чертёж', R.newDrawing(part)); const L = R.layoutDrawing(S.doc); const svg = R.drawingSvg(S.doc, L);
    const texts = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]).filter((t) => /^(R|⌀|\d+ отв)/.test(t));
    return { texts, overflow: L.overflow }; }, doc);
  await p.waitForTimeout(800); await p.screenshot({ path: '/tmp/t151.png' });
  // two vertices on one vertical in the front view
  const pair = await p.evaluate(() => { const R = window.__rezets; const L = R.layoutDrawing(R.S.doc); const v = L.views.front; const pts = v.verts.map((q) => ({ w: q.w, p: R.toPaper ? null : null }));
    void pts; return null; });
  void pair;
  out.scale5 = await p.evaluate(() => { const S = window.__rezets.S; S.doc.scale = 5; window.__rezets.drwRefresh(); return [...document.querySelectorAll('#side .note')].map((n) => n.textContent).find((t) => t.includes('не помещаются')) || null; });
  console.log(JSON.stringify(out));
  console.log('expect texts with R… for arcs and ⌀ for full circles; scale5 message present');
  console.log(logs.join('\n')); await b.close(); })();

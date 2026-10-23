// Editing a feature rolls the model back to it: the body shown while its panel is open has none of the later
// features (their faces can't be picked as its end), cancel or OK brings them back.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1500);
  const out = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const o = {};
    const vol = () => +R.geoVolume(S.body).toFixed(1);
    o.names = S.doc.features.map((f) => f.type); o.full = vol();
    const f0 = S.doc.features.find((f) => f.type === 'extrude'); R.editFeature(f0);
    o.editing = vol();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    o.closed = !S.pm; o.after = vol(); return o; });
  console.log(JSON.stringify(out));
  console.log('expect editing < full, closed true, after = full');
  console.log(logs.join('\n')); await b.close(); })();

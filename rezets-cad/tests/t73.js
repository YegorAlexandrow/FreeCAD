// The rollback bar follows the mouse among the tree rows and rolls the model back on release; dragging it back restores it.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm2_user2.json', 'utf8'));
(async () => {
  const { b, p, logs } = await open();
  await p.evaluate((d) => window.__rezets.loadDoc(d), doc);
  const drag = async (toIndex) => { const bar = await p.$('#side .rollbar'); const bb = await bar.boundingBox(); await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down();
    let y, want = null; if (toIndex == null) { const rows = await p.$$('#side .row[data-index]'); const rb = await rows.at(-1).boundingBox(); y = rb.y + rb.height + 4; } else { const r = (await p.$$('#side .row[data-index]'))[toIndex]; want = +(await r.getAttribute('data-index')); const rb = await r.boundingBox(); y = rb.y + 3; }
    for (let k = 1; k <= 5; k++) await p.mouse.move(bb.x + bb.width / 2, bb.y + (y - bb.y) * k / 5);
    const mid = await p.evaluate(() => window.__rezets.S.doc.rollback); await p.mouse.up(); await p.waitForTimeout(200);
    return await p.evaluate((mid) => { const R = window.__rezets; return { want: mid.want, duringDrag: mid.mid, rollback: R.S.doc.rollback, vol: R.S.body ? +R.geoVolume(R.S.body).toFixed(1) : 0, off: document.querySelectorAll('#side .row.off').length }; }, { mid, want }); };
  const v0 = await p.evaluate(() => +window.__rezets.geoVolume(window.__rezets.S.body).toFixed(1));
  const r1 = await drag(3); const r2 = await drag(null);
  console.log(JSON.stringify({ v0, r1, r2 }), '\nexpect r1 rollback = want with smaller vol and rows off, duringDrag null (no rebuild while dragging); r2 rollback null, vol = v0, 0 off');
  console.log(logs.join('\n')); await b.close();
})();

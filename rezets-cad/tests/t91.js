// STL export goes out as a zip of binary STL files (the page's downloads do not allow .stl); scraps left by
// booleans are not listed as bodies (the user's ARM2 with ten «bodies», testdata/arm2_user8_qgv.json).
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm2_user8_qgv.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  const r = await p.evaluate(async (d) => { const R = window.__rezets; R.loadDoc(d); const bs = R.splitBodies(R.S.body);
    const z = R.zipFiles(bs.map((x, i) => ({ name: 'ARM2 тело' + (i + 1) + '.stl', data: R.stlBinary(x.geo) })));
    const u8 = new Uint8Array(await z.arrayBuffer()); let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000));
    return { bodies: bs.map((x) => +x.vol.toFixed(1)), all: +R.geoVolume(R.S.body).toFixed(1), zip: btoa(s) }; }, doc);
  fs.writeFileSync('/tmp/t91.zip', Buffer.from(r.zip, 'base64'));
  console.log(JSON.stringify({ bodies: r.bodies, all: r.all })); console.log('expect two bodies summing to all, no zero ones; the zip is checked below');
  console.log(logs.join('\n')); await b.close(); })();

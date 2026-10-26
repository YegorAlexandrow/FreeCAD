// A sketch stored without its id counter (an ARM3 v2 from the cloud) still gives new points and lines real ids,
// not "NaN" for every one of them.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/data/arm3-linked.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate((doc) => { const R = window.__rezets; const sk = doc.features.find((f) => f.sk).sk; delete sk.nid;
    const before = Object.keys(sk.pts).length + Object.keys(sk.ents).length; const cs = Object.keys(sk.pts).slice(0, 2); R.makeSlot(sk, cs[0], cs[1], 1);
    const ids = [...Object.keys(sk.pts), ...Object.keys(sk.ents)]; return { added: ids.length - before, nan: ids.filter((i) => !Number.isFinite(+i)).length, unique: new Set(ids).size === ids.length }; }, doc);
  console.log(JSON.stringify(r)); console.log('expect added > 0, nan 0, unique true');
  console.log(logs.join('\n')); await b.close(); })();

// The user's ARM0: R5 fillets where the posts meet the base top run past the round rim of the base. The added
// material stays over the faces: nothing of the fillets hangs beyond the rim.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm0_user3.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((doc) => { const R = window.__rezets; const S = R.S; R.loadDoc(doc);
    const hang = () => { const pos = S.body.getAttribute('position'); let out = 0; for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i); if (y > 3.05 && y < 7.9 && Math.abs(x) > 8.05 && Math.abs(x) < 13 && Math.abs(z) > 20.11 && !R.castRay([x * 0.999, y - 0.02, z * 0.999], [0, -1, 0]).length) out++; } return out; };
    const h1 = hang(), v1 = R.geoVolume(S.body); const f = S.doc.features.find((g) => g.type === 'fillet'); f.suppressed = true; R.rebuild(); const h0 = hang(), v0 = R.geoVolume(S.body);
    return { err: S.errors, added: +(v1 - v0).toFixed(1), hangingExtra: h1 - h0 }; }, doc)));
  console.log('expect no errors, added about 71 (86 when the fillets ran on past the rim of the base as fins), hangingExtra 0');
  console.log(logs.join('\n')); await b.close(); })();

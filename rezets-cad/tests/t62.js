// The user's ARM1 hole: cylinder walls shaded with true radial normals (no dark wedges from slivers),
// the hover highlight sits on the visible side of a hole wall, and the wall has no cracks.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm1_user.json', 'utf8'));
(async () => {
  const { b, p, logs } = await open({ dark: true });
  await p.evaluate((doc) => window.__rezets.loadDoc(doc), doc);
  console.log(await p.evaluate(() => { const R = window.__rezets; const g = R.groups.body.children.find((o) => o.isMesh && !o.isLineSegments2).geometry; const nrm = g.getAttribute('normal'), pos = g.getAttribute('position');
    // every vertex of the r=2.5 and r=3.5 hole walls: normal must be radial, pointing to the axis
    let bad = 0, n = 0; for (let t = 0; t < pos.count / 3; t++) { const vs = [0, 1, 2].map((k) => 3 * t + k); const rs = vs.map((i) => Math.hypot(pos.getX(i) + 144, pos.getY(i))); const zs = vs.map((i) => pos.getZ(i));
      const R0 = [3.5, 2.5].find((R) => rs.every((r) => Math.abs(r - R) < 1e-3)); if (!R0 || Math.max(...zs) - Math.min(...zs) < 1e-3 || Math.min(...zs) < -18.51) continue;
      for (const i of vs) { n++; const x = pos.getX(i) + 144, y = pos.getY(i); const r = Math.hypot(x, y); const d = (nrm.getX(i) * x + nrm.getY(i) * y) / r; if (d > -0.999 || Math.abs(nrm.getZ(i)) > 1e-3) bad++; } }
    let near = 0; for (let i = 0; i < pos.count; i++) if (Math.abs(Math.hypot(pos.getX(i) + 144, pos.getY(i)) - 3.5) < 1e-2) near++; return 'near ' + near + ' hole wall vertices ' + n + ', not radial-inward ' + bad; }));
  await p.click('[data-view="front"]'); await p.waitForTimeout(400);
  const box = await (await p.$('#cv')).boundingBox();
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await p.mouse.down(); await p.mouse.move(box.x + box.width / 2 + 420, box.y + box.height / 2 - 120, { steps: 20 }); await p.mouse.up(); await p.waitForTimeout(300);
  await p.evaluate(() => window.__rezets.S.body.computeBoundingBox());
  const s = await p.evaluate(() => window.__rezets.toScreen(new (window.__rezets.S.body.boundingBox.min.constructor)(-144, 0, -18.5)));
  await p.mouse.move(box.x + s.x, box.y + s.y); for (let i = 0; i < 22; i++) { await p.mouse.wheel(0, -200); await p.waitForTimeout(30); }
  const s2 = await p.evaluate(() => window.__rezets.toScreen(new (window.__rezets.S.body.boundingBox.min.constructor)(-144, 3.5, -17)));
  await p.mouse.move(box.x + s2.x, box.y + s2.y); await p.waitForTimeout(400); await p.screenshot({ path: 's62.png' });
  console.log('cracks', await p.evaluate(() => { const R = window.__rezets; let miss = 0, n = 0; for (let z = -18.4; z <= -15.6; z += 0.2) for (let k = 0; k < 120; k++) { const a = k / 120 * 2 * Math.PI; n++; const h = R.castRay([-144, 0, z], [Math.cos(a), Math.sin(a), 0])[0]; if (!h || Math.abs(Math.hypot(h.point.x + 144, h.point.y) - 3.5) > 0.01) miss++; } return `rays from the axis through the r 3.5 wall: ${miss} of ${n} miss it (expect 0)`; }));
  console.log(logs.join('\n')); await b.close();
})();

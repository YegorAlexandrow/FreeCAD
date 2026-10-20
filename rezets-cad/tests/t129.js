// STL scaling: an imported plate scaled ×2 has 8× the volume, doubled hole radius and size; a part built on it
// follows; the size field shows the new box; undo of the scale (×0.5) restores it.
const open = require('./harness.js'); const fs = require('fs');
(async () => { const { b, p, logs } = await open();
  const stl = await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(-20, -10), P(20, -10), P(20, 10), P(-20, 10)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); sk.ents.h = { id: 'h', t: 'circle', c: P(-10, 0), r: 3 };
    R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 5, dir: 1, regions: null }] });
    return Array.from(new Uint8Array(R.stlBinary(R.S.body))); });
  const file = '/tmp/claude-0/-home-user/922fd1d6-a4fe-5bbc-a891-f41e1f96d977/scratchpad/plate2.stl'; fs.writeFileSync(file, Buffer.from(stl));
  await p.setInputFiles('#stepIn', file); await p.waitForFunction(() => window.__rezets.S.mode === 'import', null, { timeout: 30000 });
  const imp = await p.evaluate(() => window.__rezets.activeEntry().id);
  const before = await p.evaluate(() => { const R = window.__rezets; const ent = R.activeEntry(); return { vol: +R.geoVolume(R.importGeometry(ent)).toFixed(1), cyls: ent.data.cyls.map((c) => +c.r.toFixed(2)).sort(), size: R.importSize(ent).map((v) => +v.toFixed(2)) }; });
  await p.evaluate((id) => { const R = window.__rezets; R.addDoc('part', 'Деталь', { name: 'Деталь', nid: 10, rollback: null, features: [{ id: 'f1', type: 'stepbody', name: 'STEP-тело1', doc: id }] }); R.rebuild(); window.__pv0 = R.geoVolume(R.S.body); R.switchDoc(id); }, imp);
  await p.locator('#side input[type=text]').fill('2'); await p.locator('#side button', { hasText: 'Применить' }).click();
  const after = await p.evaluate(() => { const R = window.__rezets; const ent = R.activeEntry(); return { vol: +R.geoVolume(R.importGeometry(ent)).toFixed(1), body: +R.geoVolume(R.S.body).toFixed(1), cyls: ent.data.cyls.map((c) => +c.r.toFixed(2)).sort(), scale: ent.data.scale, note: document.querySelector('#side').textContent.match(/Габарит[^м]*мм/)?.[0] }; });
  const part = await p.evaluate(() => { const R = window.__rezets; const d = R.S.project.docs.find((x) => x.name === 'Деталь'); R.switchDoc(d.id); return { v0: +window.__pv0.toFixed(1), v: +R.geoVolume(R.S.body).toFixed(1) }; });
  await p.evaluate((id) => window.__rezets.switchDoc(id), imp);
  await p.locator('#side button', { hasText: 'Вернуть размер из файла' }).click();
  const back = await p.evaluate(() => { const R = window.__rezets; const ent = R.activeEntry(); return { vol: +R.geoVolume(R.importGeometry(ent)).toFixed(1), scale: ent.data.scale, store: JSON.stringify(R.docToStore(ent)).length > 0 }; });
  console.log(JSON.stringify({ before, after, part, back }));
  console.log('expect after.vol = 8*before.vol, body = after.vol, cyls doubled, scale 2, note 80 × 40 × 10 (some order); part.v = 8*part.v0; back vol = before.vol, scale 1');
  console.log(logs.join('\n')); await b.close(); })();

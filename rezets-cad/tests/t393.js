// E30: with the mate panel open a part can still be dragged; a plain click keeps picking for the mate.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  const L = (...a) => console.log(...a);
  await p.evaluate(() => {
    const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const id = String(sk.nid++); sk.pts[id] = { id, x, y }; return id; };
    const a = P(-50, -30), bb = P(50, -30), c = P(50, 30), d = P(-50, 30); for (const [u, v] of [[a, bb], [bb, c], [c, d], [d, a]]) { const id = String(sk.nid++); sk.ents[id] = { id, t: 'line', p1: u, p2: v }; }
    const doc = { name: 'Коробка', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 15, dir: 1, regions: null }] };
    const ent = R.addDoc('part', 'Коробка', doc); R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(ent.id); R.asmInsert(ent.id);
    const asm = R.S.doc; asm.comps[1].T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 150, 7, -20, 1];
    asm.patterns = [{ id: 'p90', name: 'ЛинейныйМассив1', type: 'lin', seeds: [asm.comps[1].id], ref: { axis: 'x' }, n: 3, d: 130, angle: 360, flip: false }];
    asm.explode = { on: true, steps: [{ id: 'x91', comps: [asm.comps[1].id], dir: [0, 1, 0], d: 40 }] }; R.asmRefresh(true);
  });
  await p.waitForTimeout(400);
  const rows = () => p.evaluate(() => [...document.querySelectorAll('#side .tree .row')].map((r) => r.textContent.replace(/\s+/g, ' ').trim()).filter((t) => /Массив|Разнес|<\d>/.test(t)));
  L('rows', JSON.stringify(await rows()));
  // K29: open the pattern onto its copies, select it, delete it with Delete
  await p.evaluate(() => [...document.querySelectorAll('#side .tree .row')].find((r) => r.textContent.includes('ЛинейныйМассив1')).querySelector('.tw').click()); await p.waitForTimeout(150);
  L('opened', JSON.stringify(await rows()));
  await p.evaluate(() => [...document.querySelectorAll('#side .tree .row')].find((r) => r.textContent.includes('ЛинейныйМассив1')).click()); await p.waitForTimeout(150);
  await p.keyboard.press('Delete'); await p.waitForTimeout(150);
  L('patterns after Delete', await p.evaluate(() => window.__rezets.S.doc.patterns.length), 'comps', await p.evaluate(() => window.__rezets.S.doc.comps.length));
  // K62: the exploded view's eye collapses it
  await p.evaluate(() => [...document.querySelectorAll('#side .tree .row')].find((r) => r.textContent.includes('Разнесённый вид')).querySelector('.eye').click()); await p.waitForTimeout(150);
  L('explode on', await p.evaluate(() => window.__rezets.S.doc.explode.on));
  L(logs.join('\n')); await b.close();
})();

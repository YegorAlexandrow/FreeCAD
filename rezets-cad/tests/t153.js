// Assembly component rename by F2 (and from the menu): the new name stays after the part document is renamed; the
// measure tool hands the exploded view back when closed.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1000);
  await p.evaluate(() => { const R = window.__rezets; const S = R.S; const base = S.project.docs.find((d) => d.name === 'Кронштейн'); R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(base.id); R.asmInsert(base.id); S.asmSel = S.doc.comps[1].id; R.asmRefresh(true); });
  await p.waitForTimeout(300); await p.keyboard.press('F2'); await p.waitForTimeout(200);
  const has = await p.evaluate(() => !!document.getElementById('renameInput'));
  await p.keyboard.type('Опора правая'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  const out = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const o = {}; o.names = S.doc.comps.map((c) => c.name);
    S.project.docs.find((d) => d.name === 'Кронштейн').name = 'Кронштейн2'; R.asmRefresh(true); o.after = S.doc.comps.map((c) => c.name);
    S.doc.explode = S.doc.explode || { on: false, steps: [] }; S.doc.explode.on = true; R.cmdMeasure(); o.offWhileMeasure = !S.doc.explode.on; return o; });
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  out.has = has; out.backOn = await p.evaluate(() => window.__rezets.S.doc.explode.on);
  console.log(JSON.stringify(out));
  console.log('expect has true; names [Кронштейн<1>, Опора правая]; after [Кронштейн2<1>, Опора правая]; offWhileMeasure true, backOn true');
  console.log(logs.join('\n')); await b.close(); })();

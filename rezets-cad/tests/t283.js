// Assembly mass: components can be ticked off; with one selected the panel opens with only it counted.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const id = R.activeEntry().id; R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(id); R.asmInsert(id); });
  await p.evaluate(() => { const S = window.__rezets.S; S.asmSel = null; }); await p.click('button.tool >> text=Масса'); await p.waitForTimeout(300);
  const read = () => p.evaluate(() => [document.querySelector('#side .pm .grp .lbl')?.textContent, document.querySelector('#side .pm .grp .kv b')?.textContent]);
  const all = await read(); await p.click('#side .pm .kv input[type=checkbox] >> nth=1'); await p.waitForTimeout(200); const one = await read();
  await p.keyboard.press('Escape'); await p.evaluate(() => { const S = window.__rezets.S; S.asmSel = S.doc.comps[0].id; }); await p.click('button.tool >> text=Масса'); await p.waitForTimeout(300); const sel = await read();
  console.log(JSON.stringify({ all, one, sel })); console.log('expect all «Итого» 2m; one «Итого по отмеченным: 1 из 2» m; sel the same as one');
  console.log(logs.join('\n')); await b.close(); })();

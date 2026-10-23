// B0-22: renaming a part renames its components in the assembly (numbers kept), not a hand-renamed one.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const S = R.S; const base = S.project.docs.find((d) => d.name === 'Кронштейн'); R.addDoc('asm', 'Сборка', R.newAsm()); R.asmInsert(base.id); R.asmInsert(base.id); R.asmInsert(base.id);
    S.doc.comps[2].name = 'Мой'; S.doc.comps[2].userName = true;
    const btn = document.createElement('button'); document.body.append(btn); R.renameDoc(base, btn); const inp = btn.querySelector('input'); inp.value = 'Опора'; inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    return S.doc.comps.map((c) => c.name); })));
  console.log('expect [Опора<1>, Опора<2>, Мой]');
  console.log(logs.join('\n')); await b.close(); })();

// Tree: a name already in the tree is not given to another feature (A31); a feature dragged below the one built on it
// is named the right way round in the message (A29).
const open = require('./harness.js'); const fs0 = require('fs');
const cells = JSON.parse(fs0.readFileSync(__dirname + '/data/checker-cells.json', 'utf8'));
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(async (cells) => { const R = window.__rezets; const S = R.S; R.loadDoc(R.sampleDoc()); R.rebuild();
    const fs = S.doc.features.filter((f) => f.type !== 'sketch'); const a = fs[0], b = fs[1];
    const row = [...document.querySelectorAll('#side .row[data-fid]')].find((x) => x.dataset.fid === b.id); row.click(); await new Promise((r) => setTimeout(r, 50));
    R.renameFeature(b); const inp = document.getElementById('renameInput'); inp.value = a.name; inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    const t1 = [...document.querySelectorAll('.toast')].map((t) => t.textContent).at(-1); const nameB = b.name;
    // Деталь 12: Бобышка5 starts from a face of Бобышка3.
    R.loadDoc(cells); R.rebuild(); const b3 = S.doc.features.find((f) => f.name === 'Бобышка3'); const moved = R.moveFeature(b3.id, null);
    const t2 = [...document.querySelectorAll('.toast')].map((t) => t.textContent).at(-1);
    return { t1, nameB, aName: a.name, moved, t2 }; }, cells);
  console.log(JSON.stringify(r)); console.log('expect t1 «Имя «…» уже есть в дереве», nameB unchanged (≠ aName); moved false, t2 «Бобышка3» нужен для «Бобышка5», ниже него его не поставить');
  console.log(logs.join('\n')); await b.close(); })();

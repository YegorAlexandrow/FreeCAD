// A model imported again under the same name: the same triangles are added as another copy; other triangles (an edited
// version, here one vertex moved, which a sample of every 97th number did not see) ask to replace it, and replacing
// keeps the document, so an assembly using it gets the new shape. Undo brings the old one back.
const open = require('./harness.js'); const fs = require('fs');
const stl = fs.readFileSync(__dirname + '/data/plate3.stl').toString('base64');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const r = await p.evaluate(async (b64s) => { const R = window.__rezets; const S = R.S; const bin = atob(b64s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    const mk = () => { const pos = R.parseStl(u); return { name: 'queen', pos, nrm: null, faces: [[0, pos.length / 9]], cyls: [] }; };
    const back = R.activeEntry().id; R.addDoc('import', 'queen', mk()); const imp = R.activeEntry(); R.switchDoc(back);
    R.addDoc('asm', 'Сб', R.newAsm()); R.asmInsert(imp.id); const asmId = R.activeEntry().id; const n0 = S.project.docs.length;
    R.addImport(mk()); const sameAdded = S.project.docs.length === n0 + 1; const n1 = S.project.docs.length;
    R.switchDoc(asmId); const v2 = mk(); v2.pos[1 + 97 * 3] += 5; R.addImport(v2);
    const title = document.getElementById('mTitle').textContent; const btns = [...document.querySelectorAll('#mActs button')].map((x) => x.textContent);
    [...document.querySelectorAll('#mActs button')].find((x) => x.textContent === 'Заменить').click(); await new Promise((r) => setTimeout(r, 200));
    const replaced = imp.data.pos[1 + 97 * 3] === v2.pos[1 + 97 * 3] && S.project.docs.length === n1 && R.activeEntry().id === imp.id;
    const t = [...document.querySelectorAll('.toast')].at(-1); [...t.querySelectorAll('button')].find((x) => x.textContent === 'Отменить').click();
    return { sameAdded, title, btns, replaced, undone: imp.data.pos[1 + 97 * 3] !== v2.pos[1 + 97 * 3] }; }, stl);
  console.log(JSON.stringify(r)); console.log('expect sameAdded true; title «queen» уже есть в проекте; buttons Заменить, Добавить отдельно, Закрыть; replaced true; undone true');
  console.log(logs.join('\n')); await b.close(); })();

// B0-25: an STL imported from the assembly's Insert panel comes back into the assembly as a component.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; R.addDoc('asm', 'Сборка', R.newAsm()); R.cmdInsert(); });
  await p.waitForTimeout(300); await p.evaluate(() => { const btn = [...document.querySelectorAll('#side .ghost-btn')].find((x) => x.textContent.startsWith('Импорт')); const input = document.getElementById('stepIn'); input.click = () => {}; btn.click(); });
  await p.evaluate(async () => { const v = [[0, 0, 0], [10, 0, 0], [0, 10, 0], [0, 0, 10]]; const tris = [[0, 2, 1], [0, 1, 3], [1, 2, 3], [0, 3, 2]]; let t = 'solid t\n';
    for (const tri of tris) t += 'facet normal 0 0 0\nouter loop\n' + tri.map((i) => `vertex ${v[i].join(' ')}`).join('\n') + '\nendloop\nendfacet\n'; t += 'endsolid t\n'; await window.__rezets.importStlFile(new File([t], 'tet.stl')); });
  await p.waitForTimeout(600);
  console.log(JSON.stringify(await p.evaluate(() => ({ mode: window.__rezets.S.mode, comps: window.__rezets.S.doc.comps?.map((c) => c.name) })))); console.log('expect mode asm, comps [tet<1>]');
  console.log(logs.join('\n')); await b.close(); })();

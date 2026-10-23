// M44: the same STL added twice opens the import already there (no silent duplicate); «Добавить копию» adds it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(async () => { const R = window.__rezets; const v = [[0, 0, 0], [10, 0, 0], [10, 10, 0], [0, 10, 0], [0, 0, 10], [10, 0, 10], [10, 10, 10], [0, 10, 10]];
    const quads = [[0, 3, 2, 1], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]; let t = 'solid box\n';
    for (const [a, b2, c, d] of quads) for (const tri of [[a, b2, c], [a, c, d]]) t += 'facet normal 0 0 0\nouter loop\n' + tri.map((i) => `vertex ${v[i].join(' ')}`).join('\n') + '\nendloop\nendfacet\n';
    t += 'endsolid box\n'; await R.importStlFile(new File([t], 'open.stl')); const n1 = R.S.project.docs.filter((d) => d.kind === 'import').length; await R.importStlFile(new File([t], 'open.stl')); window.__n = [n1, R.S.project.docs.filter((d) => d.kind === 'import').length]; });
  await p.waitForTimeout(500);
  const n = await p.evaluate(() => window.__n); const note = await p.evaluate(() => [...document.querySelectorAll('.toast')].map((e) => e.textContent).find((x) => x.includes('уже есть')) || null);
  await p.click('.toast .acts button >> text=Добавить копию'); await p.waitForTimeout(300); const n3 = await p.evaluate(() => window.__rezets.S.project.docs.filter((d) => d.kind === 'import').length);
  console.log(JSON.stringify({ n, note, n3 })); console.log('expect n [1,1], a note «уже есть», n3 2');
  console.log(logs.join('\n')); await b.close(); })();

// The same STL added twice is added twice (the user loads several of one model): no «уже есть», no question.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(async () => { const R = window.__rezets; const v = [[0, 0, 0], [10, 0, 0], [10, 10, 0], [0, 10, 0], [0, 0, 10], [10, 0, 10], [10, 10, 10], [0, 10, 10]];
    const quads = [[0, 3, 2, 1], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]; let t = 'solid box\n';
    for (const [a, b2, c, d] of quads) for (const tri of [[a, b2, c], [a, c, d]]) t += 'facet normal 0 0 0\nouter loop\n' + tri.map((i) => `vertex ${v[i].join(' ')}`).join('\n') + '\nendloop\nendfacet\n';
    t += 'endsolid box\n'; await R.importStlFile(new File([t], 'open.stl')); const n1 = R.S.project.docs.filter((d) => d.kind === 'import').length; await R.importStlFile(new File([t], 'open.stl')); window.__n = [n1, R.S.project.docs.filter((d) => d.kind === 'import').length]; });
  await p.waitForTimeout(500);
  const n = await p.evaluate(() => window.__n); const note = await p.evaluate(() => [...document.querySelectorAll('.toast')].map((e) => e.textContent).find((x) => x.includes('уже есть')) || null);
  const modal = await p.evaluate(() => !document.getElementById('modal').hidden);
  console.log(JSON.stringify({ n, note, modal })); console.log('expect n [1,2], note null, modal false');
  console.log(logs.join('\n')); await b.close(); })();

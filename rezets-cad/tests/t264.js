// M20: an STL whose surface is open (a box without its lid) is imported with a warning about the open edges.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(async () => { const R = window.__rezets; const v = [[0, 0, 0], [10, 0, 0], [10, 10, 0], [0, 10, 0], [0, 0, 10], [10, 0, 10], [10, 10, 10], [0, 10, 10]];
    const quads = [[0, 3, 2, 1], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]; let t = 'solid box\n';
    for (const [a, b2, c, d] of quads) for (const tri of [[a, b2, c], [a, c, d]]) t += 'facet normal 0 0 0\nouter loop\n' + tri.map((i) => `vertex ${v[i].join(' ')}`).join('\n') + '\nendloop\nendfacet\n';
    t += 'endsolid box\n'; await R.importStlFile(new File([t], 'open.stl')); });
  await p.waitForTimeout(500);
  console.log(JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('.toast')].map((e) => e.textContent).filter((x) => x.includes('не замкнута'))))); console.log('expect one warning naming 4 open edges');
  console.log(logs.join('\n')); await b.close(); })();

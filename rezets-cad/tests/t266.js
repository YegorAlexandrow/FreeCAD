// B0-36: an STL dropped on the window is imported as a new document.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const n0 = await p.evaluate(() => window.__rezets.S.project.docs.length);
  await p.evaluate(() => { const v = [[0, 0, 0], [10, 0, 0], [0, 10, 0], [0, 0, 10]]; const tris = [[0, 2, 1], [0, 1, 3], [1, 2, 3], [0, 3, 2]]; let t = 'solid t\n';
    for (const tri of tris) t += 'facet normal 0 0 0\nouter loop\n' + tri.map((i) => `vertex ${v[i].join(' ')}`).join('\n') + '\nendloop\nendfacet\n'; t += 'endsolid t\n';
    const dt = new DataTransfer(); dt.items.add(new File([t], 'tet.stl')); window.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true })); });
  await p.waitForTimeout(1200);
  console.log(JSON.stringify({ added: (await p.evaluate(() => window.__rezets.S.project.docs.length)) - n0, name: await p.evaluate(() => window.__rezets.S.project.docs.at(-1).name) })); console.log('expect added 1, name tet');
  console.log(logs.join('\n')); await b.close(); })();

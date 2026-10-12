// Extra relations are red on the sketch and listed with the ones they repeat; a click selects the group.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open();
  await p.evaluate(() => { const R = window.__rezets; R.startSketch(R.PLANES.front); const sk = R.S.doc.features.at(-1).sk;
    sk.pts = { a: { id: 'a', x: 0, y: 0 }, b: { id: 'b', x: 10, y: 0 }, m: { id: 'm', x: 5, y: 0 } }; sk.ents = { L: { id: 'L', t: 'line', p1: 'a', p2: 'b' } };
    sk.cons = { h: { id: 'h', t: 'horizontal', refs: ['L'] }, o1: { id: 'o1', t: 'midpoint', refs: ['m', 'L'] }, o2: { id: 'o2', t: 'online', refs: ['m', 'L'] } };
    R.commitSketch(); });
  await p.waitForTimeout(300);
  console.log(JSON.stringify(await p.evaluate(() => { const R = window.__rezets; const a = R.S.analysis; const g0 = document.querySelectorAll('#overlay .glyph.bad').length;
    const rows = [...document.querySelectorAll('#side .rel.bad')]; rows[0]?.click();
    return { bad: g0, red: [...a.redundant], repeats: rows.map((r) => r.textContent), sel: [...R.S.sel].sort(), pill: document.querySelector('#side .pill')?.textContent }; })));
  console.log('expect red [o2], row «Точка на прямой повторяет Середина», 1 red glyph, sel c:o1,c:o2, pill Переопределён');
  console.log(logs.join('\n')); await b.close();
})();

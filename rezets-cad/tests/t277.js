// Document switcher: Ctrl+O shows the documents as tiles with pictures, the previous document first; arrows and Enter
// open one; typing filters by name.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const mk = (w, hgt) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(w, 0), P(w, hgt), P(0, hgt)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
      return { name: 'X', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null }] }; };
    R.loadDoc(mk(40, 20)); R.addDoc('part', 'Shaft', mk(10, 10)); R.addDoc('part', 'Cover', mk(60, 5)); });
  await p.mouse.move(700, 450); await p.keyboard.press('Control+o'); await p.waitForTimeout(1500);
  const st = () => p.evaluate(() => ({ open: !document.getElementById('menu').hidden, tiles: [...document.querySelectorAll('#menu .dl-tile')].map((t) => t.textContent + (t.querySelector('img') ? '🖼' : '')), focus: document.activeElement?.closest?.('#menu') ? document.activeElement.textContent : document.activeElement?.tagName, active: window.__rezets.activeEntry().name }));
  const first = await st();
  await p.keyboard.press('Enter'); await p.waitForTimeout(800); const back = await st();
  await p.keyboard.press('Control+o'); await p.waitForTimeout(500); await p.keyboard.type('cov'); await p.waitForTimeout(200); const found = await st();
  await p.keyboard.press('Enter'); await p.waitForTimeout(800); const opened = await st();
  console.log(JSON.stringify({ first, back, found, opened }));
  console.log('expect first: open, recent Shaft focused, tiles with pictures; back.active Shaft; found only Cover; opened.active Cover');
  await p.keyboard.press('Control+o'); await p.waitForTimeout(800); await p.screenshot({ path: process.env.SHOT || '/dev/null' }).catch(() => {});
  console.log(logs.join('\n')); await b.close(); })();

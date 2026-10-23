// The documents opened just before sit next to the current one and open with one click; pointing at one shows its
// picture. The axis triad turns with the view. Notes of the document being left go away.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => { const R = window.__rezets; const mk = (w) => { const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; }; const q = [P(0, 0), P(w, 0), P(w, 10), P(0, 10)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; });
      return { name: 'X', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.top, sk }, { id: 'f2', type: 'extrude', name: 'Бобышка1', sketch: 'f1', mode: 'add', end: 'blind', depth: 10, dir: 1, regions: null }] }; };
    R.loadDoc(mk(40)); R.addDoc('part', 'Shaft', mk(10)); R.toast('Заметка о детали Shaft', 'info'); R.addDoc('part', 'Cover', mk(60)); });
  await p.waitForTimeout(300);
  const tabs = () => p.evaluate(() => [...document.querySelectorAll('#docTabs .doctab')].map((t) => t.textContent));
  const before = await tabs(); const toasts = await p.evaluate(() => [...document.querySelectorAll('#toasts .toast')].map((t) => t.textContent));
  await p.hover('#docTabs .doctab.recent >> nth=0'); await p.waitForTimeout(300); const peek = await p.evaluate(() => !!document.querySelector('#docPeek:not([hidden]) img'));
  await p.click('#docTabs .doctab.recent >> nth=0'); await p.waitForTimeout(500); const after = await tabs();
  console.log(JSON.stringify({ before, toasts, peek, after }));
  console.log('expect before [Cover▾, Shaft, Кронштейн]; no toast about Shaft; peek true; after [Shaft▾, Cover, Кронштейн]');
  await p.screenshot({ path: process.env.SHOT || '/dev/null', clip: { x: 0, y: 0, width: 700, height: 860 } }).catch(() => {});
  console.log(logs.join('\n')); await b.close(); })();

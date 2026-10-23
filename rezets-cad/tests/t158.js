// Edits that did not reach the cloud (it was down) and a newer cloud copy saved elsewhere meanwhile: on reopening the
// app asks which to keep instead of silently taking the cloud one; with no newer cloud copy the local edits go up.
const open = require('./harness.js');
const mock = () => {
  const ls = window.localStorage; if (!sessionStorage.getItem('__init')) { ls.clear(); sessionStorage.setItem('__init', '1'); } const load = () => new Map(JSON.parse(ls.getItem('__store') || '[]')); const save = (m) => ls.setItem('__store', JSON.stringify([...m]));
  window.__down = ls.getItem('__down') === '1'; const sleep = () => new Promise((r) => setTimeout(r, 1));
  const docRef = (path) => ({ path, async get() { await sleep(); if (window.__down) throw Object.assign(new Error('down'), { code: 'unavailable' }); const v = load().get(path); return { exists: !!v, data: () => (v ? JSON.parse(v) : undefined) }; },
    async set(d) { await sleep(); if (window.__down) throw Object.assign(new Error('down'), { code: 'unavailable' }); const m = load(); m.set(path, JSON.stringify(d)); save(m); },
    async delete() { const m = load(); m.delete(path); save(m); }, collection: (p) => colRef(path + '/' + p) });
  const colRef = (path) => ({ path, doc: (id) => docRef(path + '/' + id) });
  const db = { doc: docRef, collection: colRef }; const user = { id: async () => 'u1' };
  window.claude = { use: async (n) => (n === 'db' ? db : n === 'user' ? user : null) };
};
(async () => { const { b, p, logs } = await open({ init: mock, clearStorage: false }); await p.waitForTimeout(5000); const out = {};
  out.start = await p.$eval('#saveState', (e) => e.dataset.state);
  // the cloud goes down, an edit is made (kept in the browser only)
  await p.evaluate(async () => { window.__down = true; localStorage.setItem('__down', '1'); const R = window.__rezets; R.S.doc.features.find((f) => f.type === 'extrude').depth = 33; R.rebuild(); R.S.touched = true; R.commitSketch && 0; });
  await p.evaluate(() => { const R = window.__rezets; R.S.doc.name = R.S.doc.name; }); await p.keyboard.press('Control+s'); await p.waitForTimeout(2500);
  out.sync = await p.evaluate(() => JSON.parse(localStorage.getItem('rezets-sync')));
  // another device saves a newer copy
  await p.evaluate(() => { localStorage.setItem('__down', '0'); const m = new Map(JSON.parse(localStorage.getItem('__store'))); const k = 'data/users/u1/project'; const meta = JSON.parse(m.get(k)); meta.savedAt = Date.now() + 1000; meta.writer = 'phone'; m.set(k, JSON.stringify(meta)); localStorage.setItem('__store', JSON.stringify([...m])); });
  await p.reload(); await p.waitForTimeout(6000);
  out.modal = await p.evaluate(() => (document.getElementById('modal').hidden ? null : document.getElementById('mTitle').textContent));
  out.state = await p.$eval('#saveState', (e) => e.dataset.state + ' ' + e.title); out.sync2 = await p.evaluate(() => localStorage.getItem('rezets-sync')); out.toasts = await p.evaluate(() => [...document.querySelectorAll('.toast')].map((t) => t.textContent));
  out.depth = await p.evaluate(() => window.__rezets.S.doc.features?.find((f) => f.type === 'extrude')?.depth);
  console.log(JSON.stringify(out));
  console.log('expect start saved; sync.dirty true; after reload a modal «В облаке более новая версия», depth still 33 (browser copy) until chosen');
  console.log(logs.join('\n')); await b.close(); })();

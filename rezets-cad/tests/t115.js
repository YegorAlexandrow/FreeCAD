// A cloud write that never answers: the badge leaves «Сохраняю…» after the time limit (offline, with the last
// saved time in its tooltip) and the save is tried again by itself, ending «Сохранено HH:MM».
const open = require('./harness.js');
const mock = () => {
  const store = window.__store = new Map(); window.__hang = false; const sleep = () => new Promise((r) => setTimeout(r, 1));
  const docRef = (path) => ({ path, async get() { await sleep(); const v = store.get(path); return { exists: !!v, data: () => (v ? JSON.parse(v) : undefined) }; },
    async set(d) { if (window.__hang) { window.__hang = false; return new Promise(() => {}); } await sleep(); store.set(path, JSON.stringify(d)); }, async delete() { store.delete(path); }, collection: (p) => colRef(path + '/' + p) });
  const colRef = (path) => ({ path, doc: (id) => docRef(path + '/' + id) });
  const db = { doc: docRef, collection: colRef }; const user = { id: async () => 'u1' };
  window.claude = { use: async (n) => (n === 'db' ? db : n === 'user' ? user : null) };
};
(async () => {
  const { b, p, logs } = await open({ init: mock });
  await p.waitForTimeout(2500); const st = () => p.$eval('#saveState', (e) => [e.dataset.state, e.textContent, e.title]);
  const out = { start: await st() };
  await p.evaluate(() => { window.__hang = true; const R = window.__rezets; R.S.doc.features.find((f) => f.type === 'extrude').depth += 1; R.rebuild(); R.cloudSave(); });
  await p.waitForTimeout(1000); out.during = await st();
  await p.waitForTimeout(31000); out.after = await st();
  await p.waitForTimeout(18000); out.retried = await st();
  console.log(JSON.stringify(out), '\nexpect start saved; during saving; after offline (tooltip with last save time); retried saved');
  console.log(logs.join('\n')); await b.close();
})();

// The cloud refuses a write for the call rate (resource_exhausted): «Жду облако», then a save by itself in 30 s;
// a click on the badge retries at once.
const open = require('./harness.js');
const mock = () => {
  const store = window.__store = new Map(); window.__hang = false; const sleep = () => new Promise((r) => setTimeout(r, 1));
  const docRef = (path) => ({ path, async get() { await sleep(); const v = store.get(path); return { exists: !!v, data: () => (v ? JSON.parse(v) : undefined) }; },
    async set(d) { if (window.__hang) { window.__hang = false; throw Object.assign(new Error('rate'), { code: 'resource_exhausted' }); } await sleep(); store.set(path, JSON.stringify(d)); }, async delete() { store.delete(path); }, collection: (p) => colRef(path + '/' + p) });
  const colRef = (path) => ({ path, doc: (id) => docRef(path + '/' + id) });
  const db = { doc: docRef, collection: colRef }; const user = { id: async () => 'u1' };
  window.claude = { use: async (n) => (n === 'db' ? db : n === 'user' ? user : null) };
};
(async () => {
  const { b, p, logs } = await open({ init: mock });
  await p.waitForTimeout(7000); const st = () => p.$eval('#saveState', (e) => [e.dataset.state, e.textContent, e.title]);
  const out = { start: await st() };
  await p.evaluate(() => { window.__hang = true; const R = window.__rezets; R.S.doc.features.find((f) => f.type === 'extrude').depth += 1; R.rebuild(); R.cloudSave(); });
  await p.waitForTimeout(1000); out.during = await st(); await p.click('#saveState'); await p.waitForTimeout(1500); out.clicked = await st();
  
  
  console.log(JSON.stringify(out), '\nexpect start saved; during «Жду облако» with the reason in the tooltip; clicked saved');
  console.log(logs.join('\n')); await b.close();
})();

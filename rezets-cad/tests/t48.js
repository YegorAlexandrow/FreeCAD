// Cloud storage against an in-memory stand-in for the artifact database.
const open = require('./harness.js');
const mock = () => {
  const store = window.__store = new Map(); const sleep = () => new Promise((r) => setTimeout(r, 1));
  const docRef = (path) => ({ path, async get() { await sleep(); const v = store.get(path); return { exists: !!v, data: () => (v ? JSON.parse(v) : undefined) }; }, async set(d) { await sleep(); const s = JSON.stringify(d); if (s.length > 256 * 1024) throw { code: 'invalid_argument', message: 'too big ' + s.length }; store.set(path, s); },
    async delete() { store.delete(path); }, collection: (p) => colRef(path + '/' + p) });
  const colRef = (path) => ({ path, doc: (id) => docRef(path + '/' + id) });
  const db = { doc: docRef, collection: colRef }; const user = { id: async () => 'u1' };
  window.claude = { use: async (n) => (n === 'db' ? db : n === 'user' ? user : null) };
};
(async () => {
  const { b, p, logs } = await open({ init: mock });
  const L = (...a) => console.log(...a);
  await p.waitForTimeout(2500);
  L('state after start', await p.$eval('#saveState', (e) => e.dataset.state + ' ' + e.textContent), await p.evaluate(() => [...window.__store.keys()].length));
  await p.setInputFiles('#stepIn', __dirname + '/../testdata/servo.step'); await p.waitForFunction(() => window.__rezets.S.mode === 'import', null, { timeout: 60000 });
  await p.waitForTimeout(3000);
  L('after import', await p.$eval('#saveState', (e) => e.dataset.state), await p.evaluate(() => { const m = JSON.parse(window.__store.get('data/users/u1/project')); return JSON.stringify(m.docs.map((d) => [d.name, d.revs.length, d.revs[0].chunks, d.revs[0].size])); }));
  // reload the stored project into a fresh object and compare
  const same = await p.evaluate(async () => { const R = window.__rezets; const meta = await R.cloudInit(); const pr = await R.cloudLoadProject(meta); const a = JSON.stringify(pr.docs.map(R.docToStore)), b2 = JSON.stringify(R.S.project.docs.map(R.docToStore)); return [a.length, a === b2]; });
  L('round trip', JSON.stringify(same));
  // edit the part twice -> revisions accumulate; damage the newest -> previous loads
  await p.pickDoc('Кронштейн'); await p.waitForTimeout(500);
  for (const dep of [14, 16, 18]) { await p.evaluate((dep) => { const R = window.__rezets; R.S.doc.features.find((f) => f.name === 'Бобышка1').depth = dep; R.rebuild(); R.S.undo.push('x'); }, dep); await p.evaluate(() => window.__rezets.cloudSave()); await p.waitForTimeout(200); }
  const rv = await p.evaluate(async () => { const m = JSON.parse(window.__store.get('data/users/u1/project')); const d = m.docs.find((x) => x.name === 'Кронштейн'); window.__store.delete(`data/users/u1/project/chunks/${d.id}~${d.revs[0].rev}~0`); const R = window.__rezets; const pr = await R.cloudLoadProject(await R.cloudInit()); return [d.revs.length, pr.docs.find((x) => x.name === 'Кронштейн').data.features.find((f) => f.name === 'Бобышка1').depth, [...window.__store.keys()].filter((k) => k.includes('chunks')).length]; });
  L('revisions kept, depth after damaged newest (expect 16), chunk docs', JSON.stringify(rv));
  // another window saves later -> this one stops
  await p.evaluate(() => { const m = JSON.parse(window.__store.get('data/users/u1/project')); m.savedAt = Date.now() + 1000; m.writer = 'other'; window.__store.set('data/users/u1/project', JSON.stringify(m)); });
  await p.evaluate(() => window.__rezets.cloudSave()); await p.waitForTimeout(200);
  L('conflict', await p.$eval('#saveState', (e) => e.dataset.state));
  L(logs.join('\n')); await b.close();
})();

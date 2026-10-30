// M13: a deleted document goes to the trash in the cloud with its latest version and comes back from the document
// list; its stored parts stay while it is there.
const open = require('./harness.js');
const mock = () => {
  const store = window.__store = new Map(); window.__failAt = -1; window.__sets = []; const sleep = () => new Promise((r) => setTimeout(r, 1));
  const docRef = (path) => ({ path, async get() { await sleep(); const v = store.get(path); return { exists: !!v, data: () => (v ? JSON.parse(v) : undefined) }; },
    async set(d) { await sleep(); if (window.__failAt === 0) { window.__failAt = -1; throw Object.assign(new Error('full'), { code: 'quota_exceeded' }); } if (window.__failAt > 0) window.__failAt--; window.__sets.push(path); store.set(path, JSON.stringify(d)); },
    async update(d) { await sleep(); store.set(path, JSON.stringify({ ...JSON.parse(store.get(path)), ...d })); },
    async delete() { store.delete(path); }, collection: (p) => colRef(path + '/' + p) });
  const colRef = (path) => ({ path, doc: (id) => docRef(path + '/' + id) });
  const db = { doc: docRef, collection: colRef }; const user = { id: async () => 'u1' };
  window.claude = { use: async (n) => (n === 'db' ? db : n === 'user' ? user : null) };
};
(async () => { const { b, p, logs } = await open({ init: mock });
  await p.waitForTimeout(6000);
  const r = await p.evaluate(async () => { const R = window.__rezets; const S = R.S;
    R.addDoc('part', 'Корпус', { name: 'Корпус', features: [], rollback: null, nid: 1 }); const d = R.activeEntry(); d.data.features.push({ id: 'f1', type: 'sketch', name: 'Эскиз7', plane: R.PLANES.top, sk: R.newSketchData() });
    await R.cloudSave(); const id = d.id; R.deleteDoc(d, true); await R.cloudSave();
    const m = JSON.parse(window.__store.get('data/users/u1/project')); const t = (m.trash || []).find((x) => x.id === id);
    const chunks = [...window.__store.keys()].filter((k) => k.includes('/chunks/' + id + '~')).length;
    await R.restoreFromTrash(t); await new Promise((r) => setTimeout(r, 50)); const back = S.project.docs.find((x) => x.name === 'Корпус');
    await R.cloudSave(); const m2 = JSON.parse(window.__store.get('data/users/u1/project'));
    return { inTrash: !!t, chunks, back: !!back, sketch: back?.data.features[0]?.name, trashAfter: (m2.trash || []).filter((x) => x.name === 'Корпус').length }; });
  console.log(JSON.stringify(r)); console.log('expect inTrash true, chunks > 0, back true, sketch Эскиз7, trashAfter 0');
  console.log(logs.join('\n')); await b.close(); })();

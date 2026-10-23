// Cloud: a save with nothing changed but the open document writes nothing (a tab where the project is only looked at
// must not stop the one where it is edited); a document that can't be read is left out of the session but kept in the
// cloud; with nothing read at start, a project another device saved since is a conflict, not overwritten.
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
(async () => { const { b, p, logs } = await open({ init: mock }); await p.waitForTimeout(6000);
  const out = await p.evaluate(async () => { const R = window.__rezets; const S = R.S; const C = R.CLOUD; const o = {};
    await R.cloudSave(); const m1 = JSON.parse(window.__store.get('data/users/u1/project')); o.docs = m1.docs.length;
    R.addDoc('part', 'Вторая', { name: 'Вторая', nid: 10, rollback: null, features: [] }); await R.cloudSave();
    window.__sets = []; const first = S.project.docs[0].id; R.switchDoc(first); await R.cloudSave(); o.switchWrites = window.__sets.length; o.state = C.state;
    // break one stored document: the project still opens without it, and a save keeps it in the cloud
    const m2 = JSON.parse(window.__store.get('data/users/u1/project')); const bad = m2.docs.find((d) => d.name === 'Вторая');
    for (const k of [...window.__store.keys()]) if (k.includes('/chunks/' + bad.id + '~')) window.__store.delete(k);
    const pr = await R.cloudLoadProject(m2); o.loaded = pr.docs.map((d) => d.name); o.unreadable = [...C.unreadable];
    S.project.docs = S.project.docs.filter((d) => d.id !== bad.id); S.doc.features.push({ id: 'zz', type: 'sketch', name: 'Э', plane: R.PLANES.front, sk: R.newSketchData() }); await R.cloudSave();
    o.keptInCloud = JSON.parse(window.__store.get('data/users/u1/project')).docs.some((d) => d.id === bad.id);
    // nothing read at start, another device saved after that
    C.meta = null; C.initAt = Date.now() - 1000; const mm = JSON.parse(window.__store.get('data/users/u1/project')); mm.writer = 'other'; mm.savedAt = Date.now(); window.__store.set('data/users/u1/project', JSON.stringify(mm));
    S.doc.features.push({ id: 'zy', type: 'sketch', name: 'Э2', plane: R.PLANES.front, sk: R.newSketchData() }); await R.cloudSave(); o.conflict = C.conflict; return o; });
  console.log(JSON.stringify(out));
  console.log('expect switchWrites 0, state saved; loaded without «Вторая», unreadable 1; keptInCloud true; conflict true');
  console.log(logs.join('\n')); await b.close(); })();

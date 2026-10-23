// A big model under the cloud's rate limit: the part of its triangles written before «slow down» is kept, and the
// next save goes on from there instead of starting over (it never finished before).
const open = require('./harness.js'); const fs = require('fs');
const mock = () => {
  const store = window.__store = new Map(); window.__failAt = -1; window.__sets = []; const sleep = () => new Promise((r) => setTimeout(r, 1));
  const docRef = (path) => ({ path, async get() { await sleep(); const v = store.get(path); return { exists: !!v, data: () => (v ? JSON.parse(v) : undefined) }; },
    async set(d) { await sleep(); if (window.__failAt === 0) { window.__failAt = -1; throw Object.assign(new Error('slow down'), { code: window.__failCode || 'quota_exceeded' }); } if (window.__failAt > 0) window.__failAt--; window.__sets.push(path); store.set(path, JSON.stringify(d)); },
    async update(d) { await sleep(); store.set(path, JSON.stringify({ ...JSON.parse(store.get(path)), ...d })); },
    async delete() { store.delete(path); }, collection: (p) => colRef(path + '/' + p) });
  const colRef = (path) => ({ path, doc: (id) => docRef(path + '/' + id) });
  const db = { doc: docRef, collection: colRef }; const user = { id: async () => 'u1' };
  window.claude = { use: async (n) => (n === 'db' ? db : n === 'user' ? user : null) };
};
(async () => { const { b, p, logs } = await open({ init: mock }); await p.waitForTimeout(6000);
  await p.setInputFiles('#stepIn', __dirname + '/../testdata/servo_horn.step'); await p.waitForFunction(() => window.__rezets.S.mode === 'import', null, { timeout: 60000 }); await p.waitForTimeout(500);
  const out = await p.evaluate(async () => { const R = window.__rezets; const C = R.CLOUD; const o = {}; window.__failCode = 'resource_exhausted';
    const geoSets = () => window.__sets.filter((x) => x.includes('~g')).length;
    const tries = []; for (let k = 0; k < 6; k++) { window.__sets = []; window.__failAt = 8; C.state = 'saving'; await R.cloudSave(); tries.push([geoSets(), C.state]); if (C.state === 'saved') break; }
    o.tries = tries; const m = JSON.parse(window.__store.get('data/users/u1/project')); const imp = m.docs.find((d) => d.kind === 'import'); o.stored = !!imp?.revs?.[0]?.geo;
    o.load = await R.cloudLoadProject(m).then((pr) => pr.docs.find((d) => d.kind === 'import').data.pos.length).catch((e) => 'ERR ' + e.message); return o; });
  console.log(JSON.stringify(out));
  console.log('expect each try writes up to 8 parts and the next goes on, ending saved; stored true; load = number of floats');
  console.log(logs.join('\n').split('\n').filter((l) => !l.includes('slow down') && !l.includes('    at ')).join('\n')); await b.close(); })();

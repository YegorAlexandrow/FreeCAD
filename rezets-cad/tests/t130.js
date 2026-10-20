// Cloud storage of imported models: the triangles are stored once under their hash, so a rescale or rename saves only
// a small part; a failed save removes what it uploaded, and chunks a broken save left behind are collected later;
// a model stored by an earlier version (one whole document) is not uploaded again while unchanged.
const open = require('./harness.js'); const fs = require('fs');
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
  const stl = await p.evaluate(() => { const R = window.__rezets; const sk = R.newSketchData(); const P = (x, y) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y }; return k; };
    const q = [P(-20, -10), P(20, -10), P(20, 10), P(-20, 10)]; q.forEach((a, i) => { sk.ents['l' + i] = { id: 'l' + i, t: 'line', p1: a, p2: q[(i + 1) % 4] }; }); sk.ents.h = { id: 'h', t: 'circle', c: P(-10, 0), r: 3 };
    const S = R.S; const f = { id: 'x1', type: 'sketch', name: 'Эскиз9', plane: R.PLANES.front, sk }; S.doc.features.push(f, { id: 'x2', type: 'extrude', name: 'Б9', sketch: 'x1', mode: 'add', end: 'blind', depth: 5, dir: 1, regions: null }); S.doc.rollback = null; R.rebuild();
    const g = R.solidPart ? null : null; void g; const bin = Array.from(new Uint8Array(R.stlBinary(S.body))); S.doc.features.splice(-2, 2); R.rebuild(); return bin; });
  const file = '/tmp/claude-0/-home-user/922fd1d6-a4fe-5bbc-a891-f41e1f96d977/scratchpad/plate3.stl'; fs.writeFileSync(file, Buffer.from(stl));
  await p.setInputFiles('#stepIn', file); await p.waitForFunction(() => window.__rezets.S.mode === 'import', null, { timeout: 30000 });
  const save = () => p.evaluate(async () => { window.__sets = []; await window.__rezets.cloudSave(); const m = JSON.parse(window.__store.get('data/users/u1/project')); return { sets: window.__sets.map((x) => x.split('/').pop()), state: window.__rezets.CLOUD.state, pending: m.pending || null }; });
  const out = {}; out.first = await save(); out.first.sets = out.first.sets.filter((x) => x.includes('~g')).length + ' geo chunks';
  await p.evaluate(() => { const R = window.__rezets; R.scaleImport(R.activeEntry(), 2); R.rebuild(); });
  out.scaled = await save();
  out.load = await p.evaluate(async () => { const R = window.__rezets; const m = JSON.parse(window.__store.get('data/users/u1/project')); const pr = await R.cloudLoadProject(m); const d = pr.docs.find((x) => x.kind === 'import'); const ent = { data: d.data }; return { mul: d.data.mul, n: d.data.pos.length, vol: +R.geoVolume(R.importGeometry(ent)).toFixed(1), revs: m.docs.find((x) => x.kind === 'import').revs.length }; });
  // a save that fails half-way: the chunks it wrote are removed, the meta names them as pending
  await p.evaluate(() => { const R = window.__rezets; const d = R.activeEntry().data; d.pos = d.pos.slice(); d.pos[0] += 0.5; Object.defineProperty(d, '_geo', { value: null, writable: true, configurable: true }); window.__failAt = 1; });
  out.failed = await save(); out.failed.left = await p.evaluate(() => [...window.__store.keys()].filter((k) => k.includes('/chunks/')).length);
  await p.evaluate(() => { const st = window.__store; st.set('data/users/u1/project/chunks/zz~orphan~0', '{"s":"x"}'); const m = JSON.parse(st.get('data/users/u1/project')); m.pending = [...(m.pending || []), { prefix: 'zz~orphan', n: 1 }]; st.set('data/users/u1/project', JSON.stringify(m)); });
  out.retry = await save(); out.retry.orphan = await p.evaluate(() => window.__store.has('data/users/u1/project/chunks/zz~orphan~0'));
  out.retry.sets = out.retry.sets.length;
  // legacy: rewrite the model's revision as a version before the split would have stored it
  out.legacy = await p.evaluate(async () => { const R = window.__rezets; const st = window.__store; const ent = R.activeEntry(); const m = JSON.parse(st.get('data/users/u1/project')); const dm = m.docs.find((x) => x.id === ent.id);
    const json = JSON.stringify(R.docToStore(ent)); let h = 2166136261; for (let i = 0; i < json.length; i++) { h ^= json.charCodeAt(i); h = Math.imul(h, 16777619); } const hash = (h >>> 0).toString(36) + ':' + json.length;
    for (const k of [...st.keys()]) if (k.includes('/chunks/' + ent.id + '~')) st.delete(k);
    const n = Math.ceil(json.length / 90000); for (let i = 0; i < n; i++) st.set(`data/users/u1/project/chunks/${ent.id}~old~${i}`, JSON.stringify({ s: json.slice(i * 90000, (i + 1) * 90000) }));
    dm.revs = [{ rev: 'old', chunks: n, hash, savedAt: 1, size: json.length }]; st.set('data/users/u1/project', JSON.stringify(m));
    const pr = await R.cloudLoadProject(m); const ok = pr.docs.find((x) => x.id === ent.id).data.pos.length === ent.data.pos.length;
    window.__sets = []; await R.cloudSave(); return { loaded: ok, sets: window.__sets.filter((x) => x.includes(ent.id + '~')).length };
  });
  console.log(JSON.stringify(out));
  console.log('expect first ≥1 geo chunks, saved; scaled: sets only small chunks (no ~g) + meta, saved; load mul 2, vol 8×3858.8=30870, revs 2;');
  console.log('failed: state error, pending listed, left = chunks of the two good revisions only; retry: saved, orphan false, pending null; legacy loaded true, sets 0');
  console.log(logs.join('\n')); await b.close(); })();

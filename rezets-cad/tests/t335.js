// Models stored the old (plain) way are packed one per save: a save with an edited part goes through at once instead
// of uploading every model first (16 models in one save never finished under the cloud's write limit, and no edit
// reached the cloud). Unchanged old-format models are recognised and left as they are.
const open = require('./harness.js'); const fs = require('fs');
const stl = fs.readFileSync(__dirname + '/data/plate3.stl').toString('base64');
const mock = () => {
  const store = window.__store = new Map(); window.__writes = []; const sleep = () => new Promise((r) => setTimeout(r, 1));
  const docRef = (path) => ({ path, async get() { await sleep(); const v = store.get(path); return { exists: !!v, data: () => (v ? JSON.parse(v) : undefined) }; },
    async set(d) { await sleep(); window.__writes.push(path); store.set(path, JSON.stringify(d)); }, async delete() { store.delete(path); }, collection: (p) => colRef(path + '/' + p) });
  const colRef = (path) => ({ path, doc: (id) => docRef(path + '/' + id) });
  const db = { doc: docRef, collection: colRef }; const user = { id: async () => 'u1' };
  window.claude = { use: async (n) => (n === 'db' ? db : n === 'user' ? user : null) };
};
(async () => { const { b, p, logs } = await open({ init: mock }); await p.waitForTimeout(6000);
  const r = await p.evaluate(async (b64s) => { const R = window.__rezets; const S = R.S; const bin = atob(b64s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    const back = R.activeEntry().id; const ids = [];
    for (let k = 0; k < 3; k++) { const pos = R.parseStl(u); pos[0] += k; R.addDoc('import', 'M' + k, { name: 'M' + k, pos, nrm: null, faces: [[0, pos.length / 9]], cyls: [] }); ids.push(R.activeEntry().id); }
    R.switchDoc(back); await R.cloudSave();
    // Rewrite the three models in the cloud the old plain way, as versions before packing left them.
    const st = window.__store; const mp = 'data/users/u1/project'; const meta = JSON.parse(st.get(mp)); const enc = (a) => { let s = ''; const uu = new Uint8Array(a.buffer, a.byteOffset, a.byteLength); for (let i = 0; i < uu.length; i += 32768) s += String.fromCharCode.apply(null, uu.subarray(i, i + 32768)); return btoa(s); };
    for (const id of ids) { const d = S.project.docs.find((x) => x.id === id); const dm = meta.docs.find((x) => x.id === id); const { pos, nrm, ...rest } = d.data;
      const gj = JSON.stringify({ pos: enc(pos), nrm: null }); const key = R.hashStr(gj); const json = JSON.stringify({ id: d.id, kind: d.kind, name: d.name, data: { ...rest, geo: key } }); const rev = 'old' + id;
      st.set(`${mp}/chunks/${id}~${rev}~0`, JSON.stringify({ s: json })); const gp = `${id}~g${key.replace(/[^A-Za-z0-9]/g, '_')}`; st.set(`${mp}/chunks/${gp}~0`, JSON.stringify({ s: gj }));
      dm.revs = [{ rev, chunks: 1, hash: R.hashStr(json), savedAt: Date.now(), size: json.length + gj.length, geo: { key, chunks: 1 } }]; }
    st.set(mp, JSON.stringify(meta)); const proj = await R.cloudLoadProject(meta); void proj;
    const fr = S.project.docs.find((x) => x.kind === 'part'); R.switchDoc(fr.id); const ex = S.doc.features.find((f) => f.type === 'extrude'); ex.depth += 3; R.rebuild();
    const out = []; for (let k = 0; k < 4; k++) { window.__writes = []; await R.cloudSave(); const m = JSON.parse(st.get(mp)); out.push({ geoWrites: window.__writes.filter((w) => w.includes('~g')).length, packed: m.docs.filter((x) => x.revs[0].geo?.v === 2).length, partSaved: JSON.stringify(m.docs.find((x) => x.id === fr.id)).length > 0 && m.docs.find((x) => x.id === fr.id).revs.length }); }
    return out; }, stl);
  console.log(JSON.stringify(r)); console.log('expect each save at most one model packed (geoWrites ≤ 1 chunk set), packed 1, 2, 3, 3; the part edit saved in the first');
  console.log(logs.join('\n')); await b.close(); })();

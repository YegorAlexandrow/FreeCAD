// An imported model is stored packed in the cloud (v2): several times smaller than the plain base64, and loads back
// to the very same positions. «Файл → Место в облаке» lists the documents by size.
const open = require('./harness.js'); const fs = require('fs');
const stl = fs.readFileSync(__dirname + '/data/plate3.stl').toString('base64');
const mock = () => {
  const store = window.__store = new Map(); const sleep = () => new Promise((r) => setTimeout(r, 1));
  const docRef = (path) => ({ path, async get() { await sleep(); const v = store.get(path); return { exists: !!v, data: () => (v ? JSON.parse(v) : undefined) }; },
    async set(d) { await sleep(); store.set(path, JSON.stringify(d)); }, async delete() { store.delete(path); }, collection: (p) => colRef(path + '/' + p) });
  const colRef = (path) => ({ path, doc: (id) => docRef(path + '/' + id) });
  const db = { doc: docRef, collection: colRef }; const user = { id: async () => 'u1' };
  window.claude = { use: async (n) => (n === 'db' ? db : n === 'user' ? user : null) };
};
(async () => { const { b, p, logs } = await open({ init: mock }); await p.waitForTimeout(6000);
  const r = await p.evaluate(async (b64s) => { const R = window.__rezets; const S = R.S; const bin = atob(b64s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    const pos = R.parseStl(u); const back = R.activeEntry().id; R.addDoc('import', 'Плита', { name: 'Плита', pos, nrm: null, faces: [[0, pos.length / 9]], cyls: [] }); R.switchDoc(back); await R.cloudSave();
    const meta = JSON.parse(window.__store.get('data/users/u1/project')); const dm = meta.docs.find((d) => d.name === 'Плита'); const top = dm.revs[0];
    const chunks = [...window.__store.keys()].filter((k) => k.includes(dm.id + '~g')); const geoBytes = chunks.reduce((t, k) => t + window.__store.get(k).length, 0);
    const proj = await R.cloudLoadProject(meta); const loaded = (proj.docs || proj).find?.((d) => d.name === 'Плита') || R.S.project.docs.find((d) => d.name === 'Плита');
    const same = loaded.data.pos.length === pos.length && loaded.data.pos.every((v, i) => v === pos[i]);
    document.querySelector('#bFile').click(); await new Promise((r) => setTimeout(r, 100)); [...document.querySelectorAll('#menu button, #menu .mi, #menu div')].find((x) => x.textContent.trim() === 'Место в облаке…')?.click(); await new Promise((r) => setTimeout(r, 200));
    const rows = [...document.querySelectorAll('#projBox .proj-row')].map((x) => [...x.children].map((c) => c.textContent).join(" | "));
    return { v: top.geo?.v || null, plainKB: Math.round(pos.byteLength * 4 / 3 / 1024), geoKB: Math.round(geoBytes / 1024), same, rows: rows.slice(0, 3), head: document.querySelector('#projBox .note')?.textContent }; }, stl);
  console.log(JSON.stringify(r)); console.log('expect v 2, geoKB several times under plainKB, same true, rows with Плита first');
  console.log(logs.join('\n')); await b.close(); })();

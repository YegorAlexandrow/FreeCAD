// Without IndexedDB (storage blocked) the whole project survives a reload through localStorage, not only the open
// document.
const open = require('./harness.js');
const init = () => { if (!sessionStorage.getItem('__i')) { localStorage.clear(); sessionStorage.setItem('__i', '1'); } try { Object.defineProperty(window, 'indexedDB', { value: undefined, configurable: true }); } catch {} };
(async () => { const { b, p, logs } = await open({ init, clearStorage: false }); await p.waitForTimeout(1000);
  await p.evaluate(() => { const R = window.__rezets; R.addDoc('part', 'Вторая', { name: 'Вторая', nid: 10, rollback: null, features: [] }); R.addDoc('asm', 'Сборка', R.newAsm()); });
  await p.waitForTimeout(1500); await p.reload(); await p.waitForTimeout(3000);
  const out = await p.evaluate(() => window.__rezets.S.project.docs.map((d) => d.name));
  console.log(JSON.stringify(out));
  console.log('expect [Кронштейн, Вторая, Сборка]');
  console.log(logs.join('\n')); await b.close(); })();

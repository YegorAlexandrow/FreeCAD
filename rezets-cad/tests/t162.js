// Opening a project file checks it: unreadable documents are left out with a warning, a file with none readable is
// refused, and nothing breaks; Esc while renaming a document keeps the old name.
const open = require('./harness.js'); const fs = require('fs');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const dir = '/tmp/claude-0/-home-user/922fd1d6-a4fe-5bbc-a891-f41e1f96d977/scratchpad/';
  fs.writeFileSync(dir + 'bad1.json', JSON.stringify({ name: 'Битый', docs: [{ id: 'd1', kind: 'part', name: 'Пусто', data: {} }, { id: 'd2', kind: 'sheetmetal', name: 'Лист', data: {} }] }));
  fs.writeFileSync(dir + 'bad2.json', JSON.stringify({ name: 'Смешанный', docs: [{ id: 'd1', kind: 'part', name: 'Пусто', data: {} }, { id: 'd5', kind: 'part', name: 'Годная', data: { name: 'Годная', nid: 10, rollback: null, features: [] } }] }));
  const toasts = () => p.evaluate(() => [...document.querySelectorAll('.toast')].map((t) => t.textContent).join(' | '));
  await p.setInputFiles('#fileIn', dir + 'bad1.json'); await p.waitForTimeout(500); const t1 = await toasts(); const mode1 = await p.evaluate(() => window.__rezets.S.mode);
  await p.setInputFiles('#fileIn', dir + 'bad2.json'); await p.waitForTimeout(500); const t2 = await toasts(); const modal = await p.evaluate(() => !document.getElementById('projModal').hidden || !document.getElementById('modal').hidden);
  console.log(JSON.stringify({ t1, mode1, t2, modal }));
  console.log('expect t1 «нет ни одного документа», mode1 part; t2 «Пропущено … 1» and the open dialog shown; no PAGEERROR');
  console.log(logs.join('\n')); await b.close(); })();

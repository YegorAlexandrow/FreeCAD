// E32: a plain message lets clicks through to the model under it; a message with a button still takes clicks.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const under = () => p.evaluate(() => { const el = document.querySelector('.toast'); const r = el.getBoundingClientRect(); const hit = document.elementFromPoint(r.x + 20, r.y + r.height / 2); return hit?.closest('.toast') ? 'toast' : hit?.id || hit?.tagName; });
  await p.evaluate(() => { document.getElementById('toasts').textContent = ''; window.__rezets.toast('Обычное сообщение', 'info'); }); const plain = await under();
  await p.evaluate(() => { document.getElementById('toasts').textContent = ''; window.__rezets.toast('Сообщение с кнопкой', 'info', [{ label: 'Отменить', act: () => {} }]); }); const withBtn = await under();
  console.log(JSON.stringify({ plain, withBtn })); console.log('expect plain not toast (what lies under it), withBtn toast');
  console.log(logs.join('\n')); await b.close(); })();

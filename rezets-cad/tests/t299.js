// An unavailable tool answers a click with what it needs instead of doing nothing.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  await p.evaluate(() => window.__rezets.loadDoc({ name: 'T', nid: 10, rollback: null, features: [] })); await p.waitForTimeout(300);
  await p.click('button.tool:has-text("Скругление")', { force: true }); await p.waitForTimeout(200);
  const r = await p.evaluate(() => ({ toast: [...document.querySelectorAll('#toasts .toast')].map((t) => t.textContent).pop(), title: document.querySelector('button.tool[aria-disabled="true"]')?.title, pm: !!window.__rezets.S.pm }));
  console.log(JSON.stringify(r)); console.log('expect toast «Скругление»: сначала нарисуйте эскиз…, title with the reason, pm false');
  console.log(logs.join('\n')); await b.close(); })();

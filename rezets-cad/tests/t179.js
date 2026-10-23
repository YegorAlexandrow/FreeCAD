// A second tab of the app: both are told that edits in two tabs overwrite each other.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); const p2 = await p.context().newPage(); await p2.goto('https://rezets.test/test.html'); await p2.waitForTimeout(3000);
  const t = (pg) => pg.evaluate(() => [...document.querySelectorAll('.toast')].map((x) => x.textContent).find((x) => x.includes('ещё в одной вкладке')) || null);
  console.log(JSON.stringify({ first: await t(p), second: await t(p2) })); console.log('expect both warned');
  console.log(logs.join('\n')); await b.close(); })();

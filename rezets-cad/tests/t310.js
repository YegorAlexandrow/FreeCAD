// First launch shows «С чего начать» once; it closes and does not come back on reload.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open({ welcome: true }); await p.waitForTimeout(800);
  const first = await p.evaluate(() => document.getElementById('welcome')?.textContent || null);
  await p.screenshot({ path: process.env.SHOT || '/dev/null' }).catch(() => {});
  await p.click('#welcome .x'); const gone = await p.evaluate(() => !document.getElementById('welcome'));
  console.log(JSON.stringify({ first: first && first.slice(0, 40), gone, flag: await p.evaluate(() => localStorage.getItem('rezets-welcomed')) }));
  console.log('expect first «С чего начать…», gone true, flag 1');
  console.log(logs.join('\n')); await b.close(); })();

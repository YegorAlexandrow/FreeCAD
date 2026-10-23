// Saving the project on a page opened on its own downloads a .json file instead of showing its text.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(800);
  const dl = p.waitForEvent('download', { timeout: 10000 }).catch(() => null);
  await p.click('#bFile'); await p.click('#menu button >> text=Сохранить проект'); const d = await dl;
  const r = { file: !!d, modal: await p.evaluate(() => !document.getElementById('modal').hidden) };
  console.log(JSON.stringify(r)); console.log('expect file true, modal false');
  console.log(logs.join('\n')); await b.close(); })();

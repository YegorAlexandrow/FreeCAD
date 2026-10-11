const open = require('./harness.js');
(async () => { const { b, p, logs } = await open({ viewport: { width: 390, height: 780 } });
  await p.screenshot({ path: 'shot9_phone.png' });
  console.log('phone overflow', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), logs.join('\n')); await b.close(); })();

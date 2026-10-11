const { chromium } = require(process.env.PW);
(async () => {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: '127.0.0.1,localhost' } });
  const p = await b.newPage({ ignoreHTTPSErrors: true });
  p.on('requestfailed', r => console.log('FAIL', r.url(), r.failure()?.errorText));
  p.on('response', r => { if (r.status() >= 400) console.log('HTTP', r.status(), r.url()); });
  await p.goto('http://127.0.0.1:18931/test.html'); await p.waitForTimeout(5000); await b.close();
})();

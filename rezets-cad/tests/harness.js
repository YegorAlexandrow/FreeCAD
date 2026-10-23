// Shared test harness: serves test.html at a fake https origin, CDN through the proxy.
const { chromium } = require(process.env.PW);
const fs = require('fs');
const ROOT = require('path').resolve(__dirname, '..');
module.exports = async function open(opts = {}) {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY }, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: opts.viewport || { width: 1400, height: 860 }, ignoreHTTPSErrors: true, colorScheme: opts.dark ? 'dark' : 'light' });
  await ctx.route('https://rezets.test/**', r => r.request().url().endsWith('.wasm')
    ? r.fulfill({ status: 200, contentType: 'application/wasm', body: fs.readFileSync(process.env.OCCT_WASM || ROOT + '/occt-import-js.wasm') })
    : r.fulfill({ status: 200, contentType: 'text/html', body: fs.readFileSync(process.env.TEST_HTML || ROOT + '/test.html', 'utf8') }));
  if (opts.clearStorage !== false) await ctx.addInitScript(() => { try { localStorage.clear(); } catch {} });
  if (opts.init) await ctx.addInitScript(opts.init);
  const p = await ctx.newPage(); const logs = [];
  // Documents are a dropdown list: open it and pick the first document whose name has this text.
  p.pickDoc = async (text) => { await p.click('.doccur'); await p.locator('#menu .dl-tile', { hasText: text }).first().click(); };
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', e => logs.push('PAGEERROR: ' + e.message + '\n' + e.stack));
  await p.goto('https://rezets.test/test.html');
  try { await p.waitForFunction(() => window.__rezets, null, { timeout: 30000 }); } catch (e) { console.log('LOAD FAILED\n' + logs.join('\n')); throw e; }
  await p.waitForTimeout(1500);
  return { b, p, logs };
};

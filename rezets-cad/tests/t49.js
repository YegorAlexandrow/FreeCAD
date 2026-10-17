// End to end with the local server: storage on disk, project manager, versions, two windows.
const { chromium } = require(process.env.PW);
const { spawn } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
(async () => {
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'rz-')); const port = 8771;
  const srv = spawn('python3', [path.join(__dirname, '../server/rezets_server.py'), '--data', data, '--port', String(port), '--app', path.join(__dirname, '../rezets-cad.html')], { env: { ...process.env, REZETS_QUIET: '1' } });
  await new Promise((r) => setTimeout(r, 800));
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: '<-loopback>' }, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 1400, height: 860 } }); const logs = [];
  // The browser reaches the server through a route (its proxy does not pass loopback).
  await ctx.route('https://rezets.local/**', async (r) => { const req = r.request(); const u = new URL(req.url()); const res = await fetch(`http://127.0.0.1:${port}${u.pathname}${u.search}`, { method: req.method(), headers: { 'Content-Type': 'application/json' }, body: ['GET', 'HEAD'].includes(req.method()) ? undefined : req.postDataBuffer() });
    await r.fulfill({ status: res.status, headers: Object.fromEntries(res.headers), body: Buffer.from(await res.arrayBuffer()) }); });
  const page = async () => { const p = await ctx.newPage(); p.on('pageerror', (e) => logs.push('PAGEERROR ' + e.message)); p.on('console', (m) => logs.push(m.type() + ' ' + m.text())); await p.goto('https://rezets.local/'); try { await p.waitForFunction(() => window.__rezets?.SRV?.pid && window.__rezets.S.body, null, { timeout: 40000 }); } catch (e) { console.log(logs.join('\n')); await p.screenshot({ path: 's49_fail.png' }); throw e; } await p.waitForTimeout(500); return p; };
  const L = (...a) => console.log(...a);
  const p = await page();
  L('state', await p.$eval('#saveState', (e) => e.dataset.state), await p.$eval('#bProjects', (e) => e.textContent), 'url', p.url().replace(/^.*\?/, '?'));
  const files = () => fs.readdirSync(path.join(data, 'projects')).flatMap((pid) => fs.readdirSync(path.join(data, 'projects', pid, 'docs')).map((f) => pid + '/' + f));
  L('on disk', JSON.stringify(files()));
  // edit, wait for the save, check the file
  await p.evaluate(() => { const R = window.__rezets; R.S.doc.features.find((f) => f.name === 'Бобышка1').depth = 15; R.rebuild(); R.S.undo.push('x'); }); await p.evaluate(() => window.__rezets.S.project && window.__rezets.serverSave());
  await p.waitForTimeout(400);
  const pid = await p.evaluate(() => window.__rezets.SRV.pid); const doc1 = JSON.parse(fs.readFileSync(path.join(data, 'projects', pid, 'docs', 'd1.json'), 'utf8'));
  L('saved depth', doc1.data.features.find((f) => f.name === 'Бобышка1').depth, 'rev', doc1.rev, 'state', await p.$eval('#saveState', (e) => e.dataset.state));
  // second window, both edit the same document -> the second save is a conflict
  const p2 = await page(); L('second window depth', await p2.evaluate(() => window.__rezets.S.doc.features.find((f) => f.name === 'Бобышка1').depth));
  await p2.evaluate(() => { const R = window.__rezets; R.S.doc.features.find((f) => f.name === 'Бобышка1').depth = 20; R.rebuild(); }); await p2.evaluate(() => window.__rezets.serverSave());
  await p.evaluate(() => { const R = window.__rezets; R.S.doc.features.find((f) => f.name === 'Бобышка1').depth = 25; R.rebuild(); }); await p.evaluate(() => window.__rezets.serverSave());
  L('conflict in window 1', await p.$eval('#saveState', (e) => e.dataset.state), 'disk depth', JSON.parse(fs.readFileSync(path.join(data, 'projects', pid, 'docs', 'd1.json'), 'utf8')).data.features.find((f) => f.name === 'Бобышка1').depth);
  await p.locator('.toast button', { hasText: 'Оставить мой' }).click(); await p.waitForTimeout(400);
  L('after keep mine', JSON.parse(fs.readFileSync(path.join(data, 'projects', pid, 'docs', 'd1.json'), 'utf8')).data.features.find((f) => f.name === 'Бобышка1').depth, await p.$eval('#saveState', (e) => e.dataset.state));
  await p2.close();
  // versions menu on the tab
  await p.locator('.doccur').click({ button: 'right' }); await p.locator('#menu button', { hasText: 'Прежние версии' }).click(); await p.waitForTimeout(300);
  L('versions', await p.$$eval('#menu button', (els) => els.map((e) => e.textContent).length));
  await p.locator('#menu button').last().click(); await p.waitForTimeout(800);
  L('restored oldest depth', await p.evaluate(() => window.__rezets.S.doc.features.find((f) => f.name === 'Бобышка1').depth));
  // project manager: new project, back
  await p.click('#bProjects'); await p.waitForTimeout(300); L('projects', await p.$$eval('.proj-row .nm', (els) => els.map((e) => e.textContent).join(',')));
  await p.screenshot({ path: 's49_projects.png' });
  await p.locator('.proj-h button', { hasText: 'Новый проект' }).click(); await p.waitForTimeout(1200);
  L('new project', await p.$eval('#bProjects', (e) => e.textContent), await p.evaluate(() => window.__rezets.S.project.docs.map((d) => d.name).join(',')));
  await p.waitForTimeout(1000); await p.reload(); await p.waitForFunction(() => window.__rezets?.SRV?.pid, null, { timeout: 30000 }); await p.waitForTimeout(800);
  L('after reload opens last project', await p.$eval('#bProjects', (e) => e.textContent));
  L('project dirs', fs.readdirSync(path.join(data, 'projects')).length, 'tmp files', JSON.stringify(fs.readdirSync(data, { recursive: true }).filter((f) => String(f).endsWith('.tmp'))));
  L(logs.join('\n')); await b.close(); srv.kill(); fs.rmSync(data, { recursive: true, force: true });
})();

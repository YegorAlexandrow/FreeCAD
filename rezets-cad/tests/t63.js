// Many documents: the tab strip scrolls in one row, the full list and the file commands are menus.
const open = require('./harness.js');
(async () => {
  const { b, p, logs } = await open({ dark: true });
  await p.evaluate(() => { const R = window.__rezets; for (let i = 0; i < 12; i++) R.addDoc('part', 'Деталь с длинным именем ' + (i + 1), JSON.parse(JSON.stringify(R.S.doc))); });
  await p.waitForTimeout(400);
  console.log('top row fits:', await p.evaluate(() => { const row = document.querySelector('.toprow'); return row.scrollWidth <= row.clientWidth + 1; }), '| active tab visible:', await p.evaluate(() => { const t = document.querySelector('#docTabs [aria-selected="true"]').getBoundingClientRect(), box = document.getElementById('docTabs').getBoundingClientRect(); return t.left >= box.left - 1 && t.right <= box.right + 1; }));
  await p.click('#bDocs'); await p.waitForTimeout(200); console.log('docs menu items:', await p.$$eval('#menu button', (els) => els.length));
  await p.screenshot({ path: 's63.png' }); await p.keyboard.press('Escape');
  await p.click('#bFile'); await p.waitForTimeout(200); console.log('file menu:', await p.$$eval('#menu button', (els) => els.map((e) => e.textContent).join(' | ')));
  console.log(logs.join('\n')); await b.close();
})();

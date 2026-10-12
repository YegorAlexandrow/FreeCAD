// One Esc leaves a sketch tool for selection, also with a checkbox focused.
const open = require('./harness.js');
(async () => {
  const { b, p } = await open();
  await p.click('[data-view="top"]'); await p.waitForTimeout(300);
  await p.evaluate(() => { const R = window.__rezets; R.startSketch(R.PLANES.front); });
  await p.waitForTimeout(400);
  await p.keyboard.press('l'); await p.waitForTimeout(150);
  const box = await (await p.$('#cv')).boundingBox(); const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  for (const [dx, dy] of [[-200, 100], [0, 100], [100, -50]]) { await p.mouse.move(cx + dx, cy + dy, { steps: 3 }); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(150); }
  await p.mouse.move(cx + 150, cy - 80, { steps: 3 });
  const st = () => p.evaluate(() => { const S = window.__rezets.S; return JSON.stringify({ tool: S.tool, draw: !!S.draw, chain: S.draw?.chain?.length ?? S.draw?.pts?.length ?? null, focus: document.activeElement?.tagName + '#' + document.activeElement?.id, menu: !document.getElementById('menu').hidden, modal: !document.getElementById('modal').hidden }); });
  console.log('before', await st());
  for (let i = 1; i <= 2; i++) { await p.keyboard.press('Escape'); await p.waitForTimeout(120); console.log('esc', i, await st()); }
  // focus left on the checkbox in the sketch panel must not swallow Esc
  await p.keyboard.press('l'); await p.mouse.move(cx - 100, cy, { steps: 2 }); await p.mouse.down(); await p.mouse.up(); await p.mouse.move(cx, cy + 40, { steps: 2 });
  const cb = p.locator('#side input[type=checkbox]').first(); await cb.focus(); console.log('focus', await st()); await p.keyboard.press('Escape'); await p.waitForTimeout(120); console.log('esc with checkbox focus', await st());
  await b.close();
})();

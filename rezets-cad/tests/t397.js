// S0-40: a line, a rectangle and a circle drawn by dragging the mouse; a plain click still starts a chain.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); const L = (...a) => console.log(...a);
  await p.evaluate(() => { const R = window.__rezets; R.loadDoc({ name: 'Т', nid: 10, rollback: null, features: [] }); R.startSketch({ ...R.PLANES.front }); });
  await p.waitForTimeout(500);
  const box = await (await p.$('#cv')).boundingBox(); const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  const ents = () => p.evaluate(() => { const S = window.__rezets.S; const sk = S.doc.features.find((f) => f.id === S.editing).sk; const n = {}; for (const e of Object.values(sk.ents)) if (!e.ext && !e.constr) n[e.t] = (n[e.t] || 0) + 1; return JSON.stringify(n) + ' draw=' + (S.draw ? S.draw.stage : 'none'); });
  const drag = async (x0, y0, x1, y1) => { await p.mouse.move(x0, y0); await p.mouse.down(); await p.mouse.move(x1, y1, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(200); };
  await p.keyboard.press('l'); await drag(cx - 150, cy - 100, cx - 40, cy - 60); L('line drag', await ents());
  await p.keyboard.press('r'); await drag(cx + 30, cy - 120, cx + 130, cy - 40); L('rect drag', await ents());
  await p.keyboard.press('c'); await drag(cx - 100, cy + 80, cx - 60, cy + 80); L('circle drag', await ents());
  await p.keyboard.press('l'); await p.mouse.click(cx + 40, cy + 60); await p.waitForTimeout(100); L('line click', await ents());
  L(logs.join('\n')); await b.close(); })();

// Relations on several entities at once go on past one that already holds; a fillet radius that no longer fits
// between fixed line ends is refused instead of turning the lines inside out; the relation bar avoids the sketch
// geometry around the click and fades (letting clicks through) once the cursor moves away from it.
const open = require('./harness.js');
(async () => { const { b, p, logs } = await open(); await p.waitForTimeout(1200);
  const out = await p.evaluate(() => { const R = window.__rezets; const S = R.S; const o = {};
    const sk = R.newSketchData(); const P = (x, y, fixed) => { const k = String(sk.nid++); sk.pts[k] = { id: k, x, y, ...(fixed ? { fixed: true } : {}) }; return k; };
    const L = (id, a, b2) => { sk.ents[id] = { id, t: 'line', p1: a, p2: b2 }; };
    L('h0', P(-40, 30), P(-20, 30)); L('h1', P(-40, 35), P(-20, 37)); L('h2', P(-40, 40), P(-20, 43));
    sk.cons.c0 = { id: 'c0', t: 'horizontal', refs: ['h0'] };
    const c = P(0, 0), x = P(20, 0, true), y = P(0, 10, true); L('a', c, x); L('b2', c, y); sk.cons.c1 = { id: 'c1', t: 'horizontal', refs: ['a'] }; sk.cons.c2 = { id: 'c2', t: 'vertical', refs: ['b2'] };
    R.loadDoc({ name: 'T', nid: 10, rollback: null, features: [{ id: 'f1', type: 'sketch', name: 'Эскиз1', plane: R.PLANES.front, sk }] });
    R.editFeature(R.featById('f1'));
    const k = R.featById('f1').sk;
    S.sel = new Set(['e:h0', 'e:h1', 'e:h2']); const opt = R.relationOptions(k).find((q) => q[0] === 'horizontal'); R.applyRelation(opt[2]);
    o.horiz = Object.values(k.cons).filter((q) => q.t === 'horizontal').length;
    S.sel.clear();
    const fr = R.filletCorner(k, c, 3); R.solveSketch(k); o.fillet = typeof fr === 'object';
    R.setRadii(k, [k.ents[fr.arc]], 12); const arc = k.ents[fr.arc]; o.r = +arc.r.toFixed(3);
    const A = k.ents.a, B = k.ents.b2; const da = k.pts[A.p2].x - k.pts[A.p1].x, db = k.pts[B.p2].y - k.pts[B.p1].y; o.dirs = [Math.sign(da), Math.sign(db)];
    o.geo = { pts: Object.values(k.pts).map((q) => [q.id, +q.x.toFixed(2), +q.y.toFixed(2)]), a: [A.p1, A.p2], b: [B.p1, B.p2], arc: [arc.c, arc.p1, arc.p2] }; return o; });
  // Relation bar: select the three lines by clicking them.
  const pt = (x, y) => p.evaluate(([x, y]) => { const R = window.__rezets; const s = R.toScreen(R.toWorld(R.featById('f1').plane, x, y)); return s; }, [x, y]);
  await p.evaluate(() => { const R = window.__rezets; R.S.sel.clear(); R.commitSketch(); }); await p.waitForTimeout(900);
  const s1 = await pt(-24, 30), s2 = await pt(-24, 36);
  const box = await p.locator('#cv').boundingBox();
  await p.mouse.click(box.x + s1.x, box.y + s1.y); await p.waitForTimeout(300); out.sel1 = await p.evaluate(() => [...window.__rezets.S.sel]); await p.keyboard.down('Control'); await p.mouse.click(box.x + s2.x, box.y + s2.y); await p.keyboard.up('Control'); await p.waitForTimeout(300);
  out.bar = await p.evaluate(() => { const bar = document.getElementById('relbar'); const r = bar.getBoundingClientRect(); return { hidden: bar.hidden, far: bar.classList.contains('far'), r: [r.left, r.top, r.width, r.height].map(Math.round) }; });
  out.sel = await p.evaluate(() => [...window.__rezets.S.sel]);
  await p.mouse.move(box.x + 20, box.y + 20); await p.waitForTimeout(100);
  out.farAfter = await p.evaluate(() => document.getElementById('relbar').classList.contains('far'));
  await p.screenshot({ path: '/tmp/t145.png' });
  console.log(JSON.stringify(out));
  console.log('expect horiz 3, fillet true, r 3 (12 refused), dirs [1,1], bar shown not far, farAfter true');
  console.log(logs.join('\n')); await b.close(); })();

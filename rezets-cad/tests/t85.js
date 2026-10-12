// Middle plane: halfway between two parallel planes or faces, picked in the window; bisector for two that meet.
const open = require('./harness.js'); const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(__dirname + '/../testdata/arm2_user5_1uw.json', 'utf8'));
(async () => { const { b, p, logs } = await open();
  console.log(JSON.stringify(await p.evaluate((d) => { const R = window.__rezets; R.loadDoc(d); R.S.selectedTree = null; R.cmdPlane();
    const segBtn = [...document.querySelectorAll('#side .seg button')].find((x) => x.textContent === 'Средняя'); segBtn.click();
    const f = R.S.pm.feature; const slot1 = R.S.pm.slot;
    // Two faces of the plate: z = 0 and z = 3 (Бобышка1, 3 mm from «Спереди»).
    f.base = { face: { o: [0, 0, 0], x: [1, 0, 0], y: [0, -1, 0], n: [0, 0, -1] } }; f.base2 = { face: { o: [0, 0, 3], x: [1, 0, 0], y: [0, 1, 0], n: [0, 0, 1] } };
    const mid = R.refPlane(f);
    const f2 = { ...f, base: { std: 'top' }, base2: { std: 'right' } }; const bis = R.refPlane(f2);
    R.okPM(); const made = R.S.doc.features.at(-1);
    return { slot1, mid: { o: mid.o.map((v) => +v.toFixed(3)), n: mid.n.map((v) => +v.toFixed(3)) }, bis: { n: bis.n.map((v) => +v.toFixed(3)), o: bis.o.map((v) => +v.toFixed(3)) }, made: [made.type, made.mid, made.name] }; }, doc)));
  console.log('expect slot1 base2 after choosing «Средняя», mid o z 1.5 with n ±z, bisector of Сверху/Справа with n (±0.707, ±0.707, 0) through the origin, plane feature made with mid');
  console.log(logs.join('\n')); await b.close(); })();

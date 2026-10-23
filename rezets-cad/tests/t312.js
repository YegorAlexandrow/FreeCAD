// On a touch screen the status hint speaks of fingers; with a mouse, of buttons.
const open = require('./harness.js');
(async () => { const out = {};
  for (const touch of [false, true]) { const { b, p } = await open(touch ? { viewport: { width: 900, height: 700 }, init: () => { const mm = window.matchMedia; window.matchMedia = (q) => (q.includes('pointer: coarse') ? { matches: true, addEventListener() {} } : q.includes('any-pointer: fine') ? { matches: false, addEventListener() {} } : mm.call(window, q)); } } : {});
    await p.waitForTimeout(800); out[touch ? 'touch' : 'mouse'] = await p.evaluate(() => document.getElementById('hint')?.textContent || document.querySelector('#status, .status')?.textContent); await b.close(); }
  console.log(JSON.stringify(out)); console.log('expect mouse «Левая кнопка…», touch «Один палец…»'); })();

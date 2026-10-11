// Conflicting mate on the user's servo assembly: the message says why (angle to the locked axis).
// Needs testdata/big/servo_proj2.json (not in git).
const open = require('./harness.js'); const fs = require('fs');
const proj = fs.readFileSync(__dirname + '/../testdata/big/servo_proj2.json', 'utf8');
(async () => {
  const { b, p } = await open();
  const r = await p.evaluate((s) => { const R = window.__rezets; R.openProject(R.projectFromJSON(JSON.parse(s))); R.switchDoc('d2');
    const asm = R.S.doc; const out = [JSON.stringify(asm.mates.map((m) => [m.type, m.a.comp, m.a.kind, m.a.d.map((x) => +x.toFixed(2)), m.b.comp, m.b.kind, m.b.d.map((x) => +x.toFixed(2))]))];
    const si = R.docInfo('d3'), pi = R.docInfo('d1');
    const big = (inf) => inf.ents.map((e, i) => ({ e, i })).filter((x) => x.e.kind === 'plane').sort((a, b) => b.e.tris.length - a.e.tris.length);
    const pp = big(pi).find((x) => Math.abs(x.e.n.z) > 0.99); out.push('part face n ' + pp.e.n.toArray().map((x) => +x.toFixed(2)));
    const seen = new Set();
    for (const x of big(si).slice(0, 40)) { const k = x.e.n.toArray().map((v) => Math.round(v * 100) / 100).join(','); if (seen.has(k)) continue; seen.add(k);
      const before = R.S.doc.comps.map((c) => c.T.slice());
      const m = { id: 'mx', type: 'parallel', a: { comp: 'c2', kind: 'plane', p: x.e.p.toArray(), d: x.e.n.toArray(), e: x.i }, b: { comp: 'c1', kind: 'plane', p: pp.e.p.toArray(), d: pp.e.n.toArray(), e: pp.i }, flip: false };
      const res = R.tryAddMate(asm, m); if (res.status === 'ok') asm.mates.pop(); const why = res.status === 'conflict' ? R.explainConflict(asm, m, res.group) : ''; R.S.doc.comps.forEach((c, i) => (c.T = before[i]));
      out.push(`servo n ${k} -> ${res.status} ${why || ''}`); }
    return out; }, proj);
  console.log(r.join('\n')); await b.close();
})();

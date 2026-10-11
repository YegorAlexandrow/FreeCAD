# Резец CAD

Parametric CAD in a single HTML page (three.js + three-bvh-csg): sketches with a constraint
solver, extrude/cut/revolve, fillets and chamfers, a feature tree, multi-document projects,
STEP import (occt-import-js) and assemblies with mates.

`rezets-cad.html` is the whole application. It is published as a claude.ai artifact together
with `occt-import-js.wasm` from the npm package `occt-import-js@0.0.23` (`dist/`), which is not
kept in the repository.

## Tests

Browser tests drive the page with Playwright (Chromium, SwiftShader):

    npm pack occt-import-js@0.0.23 && tar xf occt-import-js-0.0.23.tgz package/dist/occt-import-js.wasm --strip-components=2
    ./wrap.sh
    cd tests && PW=$(npm root -g)/playwright node t20.js

`t1` checks the sample part volume, `t15` fillet and chamfer accuracy, `t20`/`t21` projects,
STEP import and assemblies.

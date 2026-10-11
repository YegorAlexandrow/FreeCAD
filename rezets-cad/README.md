# Резец CAD

Parametric CAD in a single HTML page (three.js + three-bvh-csg): sketches with a constraint
solver, extrude/cut/revolve, fillets and chamfers, a feature tree, multi-document projects,
STEP import (occt-import-js) and assemblies with mates.

`rezets-cad.html` is the whole application. It is published as a claude.ai artifact together
with `occt-import-js.wasm` from the npm package `occt-import-js@0.0.23` (`dist/`), which is not
kept in the repository.

## Local server

`server/rezets_server.py` (Python 3.9+, standard library only) serves the app and keeps
projects on disk, with a project list in the app (button with the project name in the
header), per-document history and protection against two windows overwriting each other.

    git clone -b claude/keen-keller-egnr4v --depth 1 https://github.com/YegorAlexandrow/FreeCAD
    cd FreeCAD/rezets-cad/server
    python rezets_server.py --open        # Windows: double-click start.bat

Options: `--data <folder>` (default `~/RezetsCAD`), `--port 8770`, `--host 0.0.0.0` to
reach it from other devices on the local network. Data layout:

    projects/<pid>/project.json               name, document order
    projects/<pid>/docs/<doc>.json            current documents (plain JSON)
    projects/<pid>/history/<doc>/<rev>.json.gz   earlier versions: the latest 50, then one a day for 120 days
    trash/                                    deleted projects

Writes go to a temporary file, are flushed and renamed, so a crash leaves the old or the
new file, never a broken one. Back up the data folder with any file backup tool. STEP
import needs `occt-import-js.wasm` next to `rezets-cad.html` or internet access (CDN);
three.js always loads from the CDN. API tests: `python -m unittest test_server.py`.

## Tests

Browser tests drive the page with Playwright (Chromium, SwiftShader):

    npm pack occt-import-js@0.0.23 && tar xf occt-import-js-0.0.23.tgz package/dist/occt-import-js.wasm --strip-components=2
    ./wrap.sh
    cd tests && PW=$(npm root -g)/playwright node t20.js

`t1` checks the sample part volume, `t15` fillet and chamfer accuracy, `t20`/`t21` projects,
STEP import and assemblies.

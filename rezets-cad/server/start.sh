#!/bin/sh
# Starts the Rezets CAD server and opens it in the browser. Projects are kept in ~/RezetsCAD.
cd "$(dirname "$0")" && exec python3 rezets_server.py --open "$@"

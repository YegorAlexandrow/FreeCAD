#!/bin/bash
# Wraps the page like the artifact host does, for local tests: writes test.html next to this script.
cd "$(dirname "$0")"
{ echo '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style></head><body>'; cat rezets-cad.html; echo '</body></html>'; } > test.html

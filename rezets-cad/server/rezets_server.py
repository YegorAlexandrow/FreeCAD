#!/usr/bin/env python3
"""Local server for Rezets CAD: serves the app and keeps projects on disk.

Standard library only (Python 3.9+). Run:

    python rezets_server.py                 # http://127.0.0.1:8770, data in ~/RezetsCAD
    python rezets_server.py --data D:/cad --port 9000

Layout of the data folder:

    projects/<pid>/project.json             name, document order, active document
    projects/<pid>/docs/<doc>.json          current version of each document
    projects/<pid>/history/<doc>/<rev>.json.gz   earlier versions
    trash/<pid>-<time>/                     deleted projects, kept until removed by hand

Every write goes to a temporary file, is flushed to disk and then renamed over the
old one, so a crash or power loss leaves either the old or the new file, never half
of one. Each document carries a revision number; a save based on an older revision
is refused with 409 instead of silently overwriting someone else's change.
"""
from __future__ import annotations

import argparse
import gzip
import json
import os
import re
import secrets
import shutil
import sys
import threading
import time
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import quote, urlparse

VERSION = 1
MAX_BODY = 512 * 1024 * 1024
KEEP_RECENT = 50
KEEP_DAILY_DAYS = 120
ID_RE = re.compile(r"^[A-Za-z0-9_-]{1,64}$")

HERE = Path(__file__).resolve().parent
DEFAULT_APP = HERE.parent / "rezets-cad.html"
PAGE_HEAD = (
    '<!doctype html><html><head><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
    "<style>:root{color-scheme:light dark}body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style>"
    "</head><body>"
)


def now_ms() -> int:
    return int(time.time() * 1000)


def new_id(prefix: str) -> str:
    return prefix + format(now_ms(), "x") + secrets.token_hex(3)


def atomic_write(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f".{path.name}.{secrets.token_hex(4)}.tmp")
    with open(tmp, "wb") as f:
        f.write(data)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, path)
    # The rename itself must reach the disk too.
    if hasattr(os, "O_DIRECTORY"):
        try:
            fd = os.open(path.parent, os.O_DIRECTORY)
            try:
                os.fsync(fd)
            finally:
                os.close(fd)
        except OSError:
            pass


def read_json(path: Path):
    with open(path, "rb") as f:
        return json.loads(f.read().decode("utf-8"))


def write_json(path: Path, obj) -> None:
    atomic_write(path, json.dumps(obj, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))


class Store:
    def __init__(self, root: Path) -> None:
        self.root = root
        self.projects = root / "projects"
        self.trash = root / "trash"
        self.projects.mkdir(parents=True, exist_ok=True)
        self._locks: dict[str, threading.Lock] = {}
        self._guard = threading.Lock()

    def lock(self, pid: str) -> threading.Lock:
        with self._guard:
            return self._locks.setdefault(pid, threading.Lock())

    def pdir(self, pid: str) -> Path:
        if not ID_RE.match(pid):
            raise ApiError(HTTPStatus.BAD_REQUEST, "bad project id")
        d = self.projects / pid
        if not (d / "project.json").exists():
            raise ApiError(HTTPStatus.NOT_FOUND, "project not found")
        return d

    def list_projects(self) -> list[dict]:
        out = []
        for d in self.projects.iterdir():
            meta_path = d / "project.json"
            if not meta_path.exists():
                continue
            try:
                meta = read_json(meta_path)
            except (OSError, ValueError):
                continue
            size = sum(f.stat().st_size for f in (d / "docs").glob("*.json")) if (d / "docs").exists() else 0
            out.append({"id": meta["id"], "name": meta.get("name", ""), "updated": meta.get("updated", 0),
                        "created": meta.get("created", 0), "docs": len(meta.get("order", [])), "size": size})
        out.sort(key=lambda p: p["updated"], reverse=True)
        return out

    def create_project(self, name: str) -> dict:
        pid = new_id("p")
        meta = {"id": pid, "name": name or "Проект", "created": now_ms(), "updated": now_ms(), "order": [], "active": None, "nid": 1}
        write_json(self.projects / pid / "project.json", meta)
        return meta

    def get_project(self, pid: str) -> dict:
        d = self.pdir(pid)
        meta = read_json(d / "project.json")
        docs = []
        for doc_id in meta.get("order", []):
            p = d / "docs" / f"{doc_id}.json"
            if p.exists():
                docs.append(read_json(p))
        return {**meta, "docs": docs}

    def put_meta(self, pid: str, patch: dict) -> dict:
        with self.lock(pid):
            d = self.pdir(pid)
            meta = read_json(d / "project.json")
            for k in ("name", "active", "nid", "order"):
                if k in patch:
                    meta[k] = patch[k]
            meta["updated"] = now_ms()
            write_json(d / "project.json", meta)
            return meta

    def put_doc(self, pid: str, doc_id: str, body: dict) -> dict:
        if not ID_RE.match(doc_id):
            raise ApiError(HTTPStatus.BAD_REQUEST, "bad document id")
        doc = body.get("doc")
        if not isinstance(doc, dict):
            raise ApiError(HTTPStatus.BAD_REQUEST, "doc expected")
        with self.lock(pid):
            d = self.pdir(pid)
            path = d / "docs" / f"{doc_id}.json"
            cur = read_json(path) if path.exists() else None
            base = body.get("baseRev")
            if cur is not None and not body.get("force") and base != cur.get("rev"):
                raise ApiError(HTTPStatus.CONFLICT, "document changed elsewhere", {"rev": cur.get("rev"), "updated": cur.get("updated")})
            if cur is not None:
                self._archive(d, doc_id, cur)
            rev = (cur.get("rev", 0) if cur else 0) + 1
            stored = {"id": doc_id, "kind": doc.get("kind"), "name": doc.get("name"), "data": doc.get("data"), "rev": rev, "updated": now_ms()}
            write_json(path, stored)
            meta = read_json(d / "project.json")
            if doc_id not in meta["order"]:
                meta["order"].append(doc_id)
            meta["updated"] = now_ms()
            write_json(d / "project.json", meta)
            return {"rev": rev, "updated": stored["updated"]}

    def _archive(self, d: Path, doc_id: str, cur: dict) -> None:
        h = d / "history" / doc_id
        name = f"{cur.get('rev', 0):08d}-{cur.get('updated', now_ms())}.json.gz"
        atomic_write(h / name, gzip.compress(json.dumps(cur, ensure_ascii=False).encode("utf-8")))
        self._prune(h)

    @staticmethod
    def _prune(h: Path) -> None:
        # The latest versions all stay; older ones thin out to one per day, then expire.
        files = sorted(h.glob("*.json.gz"), reverse=True)
        keep_days: set[str] = set()
        cutoff = now_ms() - KEEP_DAILY_DAYS * 86400_000
        for i, f in enumerate(files):
            if i < KEEP_RECENT:
                continue
            ts = int(f.name.split("-")[1].split(".")[0])
            day = time.strftime("%Y-%m-%d", time.localtime(ts / 1000))
            if ts < cutoff or day in keep_days:
                f.unlink(missing_ok=True)
            else:
                keep_days.add(day)

    def delete_doc(self, pid: str, doc_id: str) -> None:
        with self.lock(pid):
            d = self.pdir(pid)
            path = d / "docs" / f"{doc_id}.json"
            if path.exists():
                self._archive(d, doc_id, read_json(path))
                path.unlink()
            meta = read_json(d / "project.json")
            meta["order"] = [x for x in meta["order"] if x != doc_id]
            meta["updated"] = now_ms()
            write_json(d / "project.json", meta)

    def versions(self, pid: str, doc_id: str) -> list[dict]:
        h = self.pdir(pid) / "history" / doc_id
        out = []
        for f in sorted(h.glob("*.json.gz"), reverse=True) if h.exists() else []:
            rev, ts = f.name.split(".")[0].split("-")
            out.append({"v": f.name.split(".")[0], "rev": int(rev), "updated": int(ts), "size": f.stat().st_size})
        return out

    def version(self, pid: str, doc_id: str, v: str) -> dict:
        if not re.match(r"^\d{8}-\d+$", v):
            raise ApiError(HTTPStatus.BAD_REQUEST, "bad version")
        f = self.pdir(pid) / "history" / doc_id / f"{v}.json.gz"
        if not f.exists():
            raise ApiError(HTTPStatus.NOT_FOUND, "version not found")
        return json.loads(gzip.decompress(f.read_bytes()).decode("utf-8"))

    def delete_project(self, pid: str) -> None:
        with self.lock(pid):
            d = self.pdir(pid)
            self.trash.mkdir(parents=True, exist_ok=True)
            shutil.move(str(d), str(self.trash / f"{pid}-{now_ms()}"))

    def import_project(self, obj: dict) -> dict:
        meta = self.create_project(obj.get("name") or "Проект")
        pid = meta["id"]
        for doc in obj.get("docs", []):
            doc_id = doc.get("id") if ID_RE.match(str(doc.get("id", ""))) else new_id("d")
            self.put_doc(pid, doc_id, {"doc": doc, "force": True})
        return self.put_meta(pid, {"active": obj.get("active"), "nid": obj.get("nid", 1)})


class ApiError(Exception):
    def __init__(self, status: HTTPStatus, message: str, extra: dict | None = None) -> None:
        super().__init__(message)
        self.status = status
        self.extra = extra or {}


def make_handler(store: Store, app_path: Path):
    class Handler(BaseHTTPRequestHandler):
        server_version = "RezetsCAD/1"

        def log_message(self, fmt: str, *args) -> None:
            if os.environ.get("REZETS_QUIET"):
                return
            sys.stderr.write("%s %s\n" % (self.log_date_time_string(), fmt % args))

        def _send(self, status: int, body: bytes, ctype: str, extra_headers: dict | None = None) -> None:
            self.send_response(status)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            for k, v in (extra_headers or {}).items():
                self.send_header(k, v)
            self.end_headers()
            self.wfile.write(body)

        def _json(self, obj, status: int = 200, headers: dict | None = None) -> None:
            self._send(status, json.dumps(obj, ensure_ascii=False).encode("utf-8"), "application/json; charset=utf-8", headers)

        def _body(self):
            n = int(self.headers.get("Content-Length") or 0)
            if n > MAX_BODY:
                raise ApiError(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, "too large")
            raw = self.rfile.read(n) if n else b"{}"
            try:
                return json.loads(raw.decode("utf-8"))
            except ValueError:
                raise ApiError(HTTPStatus.BAD_REQUEST, "invalid json")

        def _route(self, method: str) -> None:
            url = urlparse(self.path)
            parts = [p for p in url.path.split("/") if p]
            try:
                if method == "GET" and (not parts or parts == ["index.html"]):
                    html = app_path.read_text(encoding="utf-8")
                    return self._send(200, (PAGE_HEAD + html + "</body></html>").encode("utf-8"), "text/html; charset=utf-8")
                if method == "GET" and parts == ["occt-import-js.wasm"]:
                    wasm = app_path.parent / "occt-import-js.wasm"
                    if wasm.exists():
                        return self._send(200, wasm.read_bytes(), "application/wasm")
                    raise ApiError(HTTPStatus.NOT_FOUND, "no local wasm")
                if not parts or parts[0] != "api":
                    raise ApiError(HTTPStatus.NOT_FOUND, "not found")
                p = parts[1:]
                if p == ["health"]:
                    return self._json({"ok": True, "version": VERSION, "data": str(store.root)})
                if p == ["projects"]:
                    if method == "GET":
                        return self._json(store.list_projects())
                    if method == "POST":
                        return self._json(store.create_project(str(self._body().get("name", ""))), 201)
                if p == ["projects", "import"] and method == "POST":
                    return self._json(store.import_project(self._body()), 201)
                if len(p) == 2 and p[0] == "projects":
                    if method == "GET":
                        return self._json(store.get_project(p[1]))
                    if method == "PATCH":
                        return self._json(store.put_meta(p[1], self._body()))
                    if method == "DELETE":
                        store.delete_project(p[1])
                        return self._json({"ok": True})
                if len(p) == 3 and p[0] == "projects" and p[2] == "export" and method == "GET":
                    proj = store.get_project(p[1])
                    out = {"format": "rezets-project", "name": proj["name"], "active": proj.get("active"), "nid": proj.get("nid", 1),
                           "docs": [{k: d.get(k) for k in ("id", "kind", "name", "data")} for d in proj["docs"]]}
                    fname = re.sub(r'[\\/:*?"<>|]+', "_", proj["name"]) + ".rezets.json"
                    return self._json(out, headers={"Content-Disposition": "attachment; filename*=UTF-8''" + quote(fname)})
                if len(p) == 4 and p[0] == "projects" and p[2] == "docs":
                    if method == "PUT":
                        return self._json(store.put_doc(p[1], p[3], self._body()))
                    if method == "DELETE":
                        store.delete_doc(p[1], p[3])
                        return self._json({"ok": True})
                if len(p) == 5 and p[0] == "projects" and p[2] == "docs" and p[4] == "versions" and method == "GET":
                    return self._json(store.versions(p[1], p[3]))
                if len(p) == 6 and p[0] == "projects" and p[2] == "docs" and p[4] == "versions" and method == "GET":
                    return self._json(store.version(p[1], p[3], p[5]))
                raise ApiError(HTTPStatus.NOT_FOUND, "not found")
            except ApiError as e:
                self._json({"error": str(e), **e.extra}, int(e.status))
            except (OSError, ValueError, KeyError) as e:
                self._json({"error": f"{type(e).__name__}: {e}"}, 500)

        def do_GET(self) -> None:
            self._route("GET")

        def do_POST(self) -> None:
            self._route("POST")

        def do_PUT(self) -> None:
            self._route("PUT")

        def do_PATCH(self) -> None:
            self._route("PATCH")

        def do_DELETE(self) -> None:
            self._route("DELETE")

    return Handler


def main(argv: list[str] | None = None) -> None:
    ap = argparse.ArgumentParser(description="Rezets CAD local server")
    ap.add_argument("--data", default=os.environ.get("REZETS_DATA", str(Path.home() / "RezetsCAD")), help="data folder (default ~/RezetsCAD)")
    ap.add_argument("--port", type=int, default=int(os.environ.get("REZETS_PORT", "8770")))
    ap.add_argument("--host", default="127.0.0.1", help="0.0.0.0 to open it to the local network")
    ap.add_argument("--app", default=str(DEFAULT_APP), help="path to rezets-cad.html")
    ap.add_argument("--open", action="store_true", help="open the app in the browser")
    args = ap.parse_args(argv)
    store = Store(Path(args.data).expanduser())
    srv = ThreadingHTTPServer((args.host, args.port), make_handler(store, Path(args.app)))
    url = f"http://{'127.0.0.1' if args.host == '0.0.0.0' else args.host}:{args.port}"
    print(f"Rezets CAD: {url}  данные: {store.root}", flush=True)
    if args.open:
        import webbrowser
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()

"""API tests for rezets_server: python -m unittest test_server.py"""
from __future__ import annotations

import json
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer
from pathlib import Path

import rezets_server as rs


class ServerTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.tmp = tempfile.TemporaryDirectory()
        app = Path(cls.tmp.name) / "app.html"
        app.write_text("<title>t</title><p>app</p>", encoding="utf-8")
        cls.store = rs.Store(Path(cls.tmp.name) / "data")
        cls.srv = ThreadingHTTPServer(("127.0.0.1", 0), rs.make_handler(cls.store, app))
        cls.base = f"http://127.0.0.1:{cls.srv.server_address[1]}"
        threading.Thread(target=cls.srv.serve_forever, daemon=True).start()

    @classmethod
    def tearDownClass(cls) -> None:
        cls.srv.shutdown()
        cls.tmp.cleanup()

    def call(self, method: str, path: str, body=None):
        data = json.dumps(body).encode() if body is not None else None
        req = urllib.request.Request(self.base + path, data=data, method=method, headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req) as r:
                return r.status, json.loads(r.read() or b"null")
        except urllib.error.HTTPError as e:
            return e.code, json.loads(e.read() or b"null")

    def test_app_and_health(self) -> None:
        with urllib.request.urlopen(self.base + "/") as r:
            html = r.read().decode()
        self.assertTrue(html.startswith("<!doctype html>") and "<p>app</p>" in html)
        self.assertEqual(self.call("GET", "/api/health")[1]["ok"], True)

    def test_document_lifecycle(self) -> None:
        st, p = self.call("POST", "/api/projects", {"name": "Тест"})
        self.assertEqual(st, 201)
        pid = p["id"]
        doc = {"kind": "part", "name": "Деталь", "data": {"features": [], "nid": 1}}
        st, r1 = self.call("PUT", f"/api/projects/{pid}/docs/d1", {"doc": doc, "baseRev": None})
        self.assertEqual((st, r1["rev"]), (200, 1))
        doc["data"]["nid"] = 2
        st, r2 = self.call("PUT", f"/api/projects/{pid}/docs/d1", {"doc": doc, "baseRev": 1})
        self.assertEqual(r2["rev"], 2)
        # A save based on the old revision is refused.
        st, r3 = self.call("PUT", f"/api/projects/{pid}/docs/d1", {"doc": doc, "baseRev": 1})
        self.assertEqual((st, r3["rev"]), (409, 2))
        st, proj = self.call("GET", f"/api/projects/{pid}")
        self.assertEqual(proj["docs"][0]["data"]["nid"], 2)
        st, vers = self.call("GET", f"/api/projects/{pid}/docs/d1/versions")
        self.assertEqual([v["rev"] for v in vers], [1])
        st, old = self.call("GET", f"/api/projects/{pid}/docs/d1/versions/{vers[0]['v']}")
        self.assertEqual(old["data"]["nid"], 1)
        self.call("PATCH", f"/api/projects/{pid}", {"name": "Новое имя", "active": "d1"})
        self.assertEqual(self.call("GET", "/api/projects")[1][0]["name"], "Новое имя")
        st, exp = self.call("GET", f"/api/projects/{pid}/export")
        self.assertEqual(exp["format"], "rezets-project")
        st, imp = self.call("POST", "/api/projects/import", exp)
        self.assertEqual(self.call("GET", f"/api/projects/{imp['id']}")[1]["docs"][0]["name"], "Деталь")
        self.call("DELETE", f"/api/projects/{pid}/docs/d1")
        self.assertEqual(self.call("GET", f"/api/projects/{pid}")[1]["docs"], [])
        self.call("DELETE", f"/api/projects/{pid}")
        self.assertEqual(self.call("GET", f"/api/projects/{pid}")[0], 404)
        self.assertTrue(any((Path(self.tmp.name) / "data" / "trash").iterdir()))

    def test_bad_ids(self) -> None:
        self.assertEqual(self.call("GET", "/api/projects/..%2F..")[0], 400)
        self.assertEqual(self.call("PUT", "/api/projects/nope/docs/d1", {"doc": {}})[0], 404)

    def test_no_temp_files_left(self) -> None:
        pid = self.call("POST", "/api/projects", {"name": "x"})[1]["id"]
        for i in range(5):
            self.call("PUT", f"/api/projects/{pid}/docs/d1", {"doc": {"kind": "part", "data": {"i": i}}, "force": True})
        self.assertEqual(list((Path(self.tmp.name) / "data").rglob("*.tmp")), [])


if __name__ == "__main__":
    unittest.main()

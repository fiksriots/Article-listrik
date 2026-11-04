"""Dashboard lokal baca-saja untuk lab, bukan server produksi."""
from contextlib import closing
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import sqlite3
from .store import baca

HTML = '''<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Dashboard Layanan Fiktif</title><style>body{font:18px system-ui;max-width:760px;margin:60px auto;padding:24px;background:#f2f6f4;color:#203b35}main{padding:32px;background:white;border-radius:18px}h1{font-size:32px}pre{white-space:pre-wrap}p{line-height:1.6}</style><main><h1>Ringkasan layanan fiktif</h1><p>Observasi pada CSV latihan. Rasio sampel ini bukan SLA atau uptime kontinu.</p><pre id="hasil" role="status">Memuat…</pre></main><script>fetch('/api/ringkasan').then(r=>{if(!r.ok)throw Error('Laporan belum tersedia');return r.json()}).then(d=>{document.getElementById('hasil').textContent=JSON.stringify(d,null,2)}).catch(e=>{document.getElementById('hasil').textContent=e.message})</script></html>'''

def buat_server(database, host='127.0.0.1', port=0):
    uri = Path(database).resolve().as_uri()+'?mode=ro'
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            status, content_type = 200, 'application/json; charset=utf-8'
            if self.path == '/':
                body, content_type = HTML.encode(), 'text/html; charset=utf-8'
            elif self.path == '/api/ringkasan':
                try:
                    with closing(sqlite3.connect(uri, uri=True, timeout=1)) as conn:
                        data = baca(conn)
                    status = 200 if data is not None else 503
                    body = json.dumps(data if data is not None else {'error':'laporan_belum_tersedia'}, allow_nan=False).encode()
                except (sqlite3.Error, ValueError):
                    status, body = 503, b'{"error":"laporan_belum_tersedia"}'
            else:
                status, body = 404, b'{"error":"tidak_ditemukan"}'
            self.send_response(status)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(body)))
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.end_headers()
            self.wfile.write(body)
        def log_message(self, format, *args):
            pass
    return ThreadingHTTPServer((host,port), Handler)

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from urllib.request import build_opener, ProxyHandler
from urllib.error import HTTPError

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        status = 200 if self.path == '/status' else 404
        body = json.dumps({'status': 'ok'} if status == 200 else {'error': 'tidak ditemukan'}).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)
    def log_message(self, format, *args):
        pass  # Hindari access log bervariasi pada contoh.

if __name__ == '__main__':
    with ThreadingHTTPServer(('127.0.0.1', 0), Handler) as server:
        thread = Thread(target=server.serve_forever, kwargs={'poll_interval': .02})
        thread.start()
        # Tidak menggunakan proxy lingkungan untuk server loopback ini.
        opener = build_opener(ProxyHandler({}))
        root = 'http://127.0.0.1:' + str(server.server_port)
        try:
            with opener.open(root + '/status', timeout=2) as response:
                body = response.read(4097)
                if len(body) > 4096:
                    raise ValueError('Respons terlalu besar.')
                print('HTTP:', response.status, json.loads(body)['status'])
            try:
                opener.open(root + '/hilang', timeout=2)
            except HTTPError as exc:
                with exc:
                    print('HTTP error:', exc.code)
        finally:
            server.shutdown()
            thread.join(timeout=3)

"""Server API untuk lab lokal, dengan data memori sementara dan batas kecil."""
from contextlib import contextmanager
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
import json
from pathlib import Path
import re
from threading import Thread,Lock

def buat_server(port=0):
    rows=[];lock=Lock()
    class Handler(BaseHTTPRequestHandler):
        def send_json(self,status,data):
            body=json.dumps(data).encode();self.send_response(status)
            self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
        def do_GET(self):
            if self.path=='/':
                body=(Path(__file__).parent/'web/index.html').read_text().replace('data-mode="simulasi"','data-mode="api"').encode()
                self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
            elif self.path=='/api/observasi':
                with lock:data=list(rows)
                self.send_json(200,data)
            else:self.send_json(404,{'error':'hilang'})
        def do_POST(self):
            self.connection.settimeout(2)
            if self.path!='/api/observasi':self.close_connection=True;return self.send_json(404,{'error':'hilang'})
            if self.headers.get_content_type()!='application/json':self.close_connection=True;return self.send_json(415,{'error':'jenis_body'})
            try:
                size=int(self.headers.get('Content-Length','0'))
                if not 1<=size<=2048:self.close_connection=True;return self.send_json(413,{'error':'ukuran'})
                raw=self.rfile.read(size)
                if len(raw)!=size:raise ValueError()
                data=json.loads(raw)
                if not isinstance(data,dict) or set(data)!={'layanan','hasil'} or not isinstance(data['layanan'],str) or not re.fullmatch(r'[A-Za-z0-9 _-]{1,40}',data['layanan'].strip()) or data['hasil'] not in ('ok','timeout','refused'):raise ValueError()
                with lock:
                    if len(rows)>=20:return self.send_json(429,{'error':'batas_lab'})
                    row={'id':len(rows)+1,'layanan':data['layanan'].strip(),'hasil':data['hasil']};rows.append(row)
                self.send_json(201,row)
            except (ValueError,TimeoutError):self.close_connection=True;self.send_json(400,{'error':'invalid'})
        def log_message(self,*args):pass
    return ThreadingHTTPServer(('127.0.0.1',port),Handler)

@contextmanager
def server_lab():
    with buat_server() as server:
        thread=Thread(target=server.serve_forever,kwargs={'poll_interval':.02});thread.start()
        try:yield 'http://127.0.0.1:'+str(server.server_port)
        finally:server.shutdown();thread.join(timeout=3)

if __name__=='__main__':
    import argparse
    parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8020);args=parser.parse_args()
    with buat_server(args.port) as server:
        print('Lab lokal http://127.0.0.1:'+str(server.server_port),flush=True)
        try:server.serve_forever()
        except KeyboardInterrupt:pass

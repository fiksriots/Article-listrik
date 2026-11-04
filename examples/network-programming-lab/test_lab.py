"""Uji kontrak dan koneksi loopback; tidak ada akses jaringan luar."""
from collections import deque
import json
import socket
import ssl
import struct
from threading import Event
import unittest
from lab_common import MAX_FRAME, recv_exact, recv_frame, send_frame, local_server
from np02_ip import validasi_endpoint
from np09_json import proses
from np10_http import Handler
from np11_tls import konteks_tls
from np14_logging import klasifikasi
from np15_monitor import periksa
from np16_status import jawab, layani

class Fragmented:
    def __init__(self, chunks):self.chunks=deque(chunks)
    def recv(self, size):
        if not self.chunks:return b''
        data=self.chunks.popleft()
        if len(data)>size:self.chunks.appendleft(data[size:])
        return data[:size]

class NetworkLab(unittest.TestCase):
    def test_endpoint_boundaries(self):
        self.assertEqual(validasi_endpoint('::1',65535),('::1',65535))
        for ip,port in [('999.1.1.1',80),('127.0.0.1',0),('127.0.0.1',True),('127.0.0.1',65536)]:
            with self.subTest(ip=ip,port=port):
                with self.assertRaises(ValueError):validasi_endpoint(ip,port)
    def test_exact_fragmentation(self):
        self.assertEqual(recv_exact(Fragmented([b'a',b'b',b'cd']),4),b'abcd')
    def test_premature_eof(self):
        for source in [Fragmented([b'\x00']),Fragmented([struct.pack('!I',5),b'xy'])]:
            with self.assertRaises(EOFError):recv_frame(source)
    def test_oversized_header(self):
        with self.assertRaises(ValueError):recv_frame(Fragmented([struct.pack('!I',MAX_FRAME+1)]))
    def test_two_frames_coalesced_and_split(self):
        payload='27°C'.encode('utf-8')
        raw=struct.pack('!I',len(payload))+payload+struct.pack('!I',1)+b'X'
        source=Fragmented([raw[:2],raw[2:6],raw[6:]])
        self.assertEqual(recv_frame(source),payload)
        self.assertEqual(recv_frame(source),b'X')
    def test_empty_frame_and_send_contract(self):
        self.assertEqual(recv_frame(Fragmented([b'\0\0\0\0'])),b'')
        for bad in ['text',b'a'*(MAX_FRAME+1)]:
            with self.assertRaises(ValueError):send_frame(None,bad)
    def test_json_validation(self):
        self.assertEqual(proses(b'{"id":9,"aksi":"ping"}'),{'id':9,'hasil':'pong'})
        for payload in [b'[]',b'null',b'{',b'{"id":true,"aksi":"ping"}',b'{"id":9,"aksi":"reboot"}',b'{"id":9,"aksi":"ping","extra":1}']:
            with self.subTest(payload=payload):
                with self.assertRaises(ValueError):proses(payload)
    def test_read_timeout_partial_frame(self):
        release=Event()
        def partial(conn):
            conn.sendall(struct.pack('!I',5)+b'x')
            release.wait(timeout=2)
        with local_server(partial) as addr:
            try:
                with socket.create_connection(addr,timeout=1) as client:
                    client.settimeout(.05)
                    with self.assertRaises(TimeoutError):recv_frame(client)
            finally:release.set()
    def test_tls_verification_preserved(self):
        context=konteks_tls()
        self.assertTrue(context.check_hostname)
        self.assertEqual(context.verify_mode,ssl.CERT_REQUIRED)
        self.assertGreaterEqual(context.minimum_version,ssl.TLSVersion.TLSv1_2)
    def test_monitor_active_refused_and_scope(self):
        with local_server(lambda conn:None) as addr,socket.socket() as reserved:
            reserved.bind(('127.0.0.1',0))
            self.assertEqual(periksa(('a',addr)),{'layanan':'a','hasil':'tcp_terhubung'})
            self.assertEqual(periksa(('b',reserved.getsockname()))['hasil'],'refused')
        with self.assertRaises(ValueError):periksa(('x',('192.0.2.1',80)))
    def test_error_classification(self):
        for exc,expected in [(TimeoutError(),'timeout'),(ConnectionRefusedError(),'refused'),(EOFError(),'eof'),(OSError(),'error_lain')]:
            self.assertEqual(klasifikasi(exc),expected)
    def test_status_unknown_and_validation(self):
        payload=json.dumps({'id':3,'aksi':'status','perangkat':'TIDAK-ADA'}).encode()
        self.assertEqual(jawab(payload),{'id':3,'ok':False,'data':None})
        for request in [[],{'id':True,'aksi':'status','perangkat':'BTS-LAB'},{'id':3,'aksi':'reboot','perangkat':'BTS-LAB'},{'id':3,'aksi':'status','perangkat':[]}]:
            with self.assertRaises(ValueError):jawab(json.dumps(request).encode())
    def test_status_roundtrip_and_invalid_json(self):
        with local_server(layani) as addr:
            for payload in [b'{"id":4,"aksi":"status","perangkat":"BTS-LAB"}',b'{bad']:
                with socket.create_connection(addr,timeout=1) as client:
                    send_frame(client,payload)
                    result=json.loads(recv_frame(client))
                    if payload.startswith(b'{"id"'):
                        self.assertEqual(result,{'id':4,'ok':True,'data':{'status':'up','rtt_ms':12}})
                    else:self.assertEqual(result,{'ok':False,'error':'permintaan_invalid'})
    def test_http_success_and_not_found(self):
        from http.server import ThreadingHTTPServer
        from threading import Thread
        from urllib.request import build_opener,ProxyHandler
        from urllib.error import HTTPError
        with ThreadingHTTPServer(('127.0.0.1',0),Handler) as server:
            worker=Thread(target=server.serve_forever,kwargs={'poll_interval':.02});worker.start()
            opener=build_opener(ProxyHandler({}));url='http://127.0.0.1:'+str(server.server_port)
            try:
                with opener.open(url+'/status',timeout=1) as response:
                    self.assertEqual(response.status,200)
                    self.assertEqual(json.load(response),{'status':'ok'})
                with self.assertRaises(HTTPError) as caught:opener.open(url+'/missing',timeout=1)
                with caught.exception:self.assertEqual(caught.exception.code,404)
            finally:server.shutdown();worker.join(timeout=3)

if __name__=='__main__':unittest.main()

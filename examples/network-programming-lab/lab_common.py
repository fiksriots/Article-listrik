"""Helper lab loopback: bukan framework server produksi."""
from contextlib import contextmanager
from queue import Queue
from socketserver import BaseRequestHandler, TCPServer
from threading import Thread
import struct

MAX_FRAME = 4096

def recv_exact(conn, size):
    if not 0 <= size <= MAX_FRAME:
        raise ValueError('Ukuran di luar batas lab.')
    data = bytearray()
    while len(data) < size:
        chunk = conn.recv(size - len(data))
        if not chunk:
            raise EOFError('Koneksi berakhir sebelum frame lengkap.')
        data.extend(chunk)
    return bytes(data)

def send_frame(conn, payload):
    if not isinstance(payload, bytes) or len(payload) > MAX_FRAME:
        raise ValueError('Payload wajib bytes, maksimal 4096 byte.')
    conn.sendall(struct.pack('!I', len(payload)) + payload)

def recv_frame(conn):
    size = struct.unpack('!I', recv_exact(conn, 4))[0]
    if size > MAX_FRAME:
        raise ValueError('Frame melebihi batas lab.')
    return recv_exact(conn, size)

@contextmanager
def local_server(handle):
    errors = Queue()
    class Handler(BaseRequestHandler):
        def handle(self):
            self.request.settimeout(2)
            try:
                handle(self.request)
            except Exception as exc:
                errors.put(exc)
    with TCPServer(('127.0.0.1', 0), Handler) as server:
        worker = Thread(target=server.serve_forever, kwargs={'poll_interval': .02})
        worker.start()
        try:
            yield server.server_address
        finally:
            server.shutdown()
            worker.join(timeout=4)
        if not errors.empty():
            raise errors.get()

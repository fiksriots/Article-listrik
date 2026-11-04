import socket
from threading import Event
from lab_common import local_server
selesai = Event()

def diam(conn):
    # Server sudah menerima koneksi, tetapi menunggu client selesai.
    if not selesai.wait(timeout=2):
        raise TimeoutError('Demo tidak menyelesaikan sinkronisasi.')

if __name__ == '__main__':
    with local_server(diam) as alamat:
        try:
            with socket.create_connection(alamat, timeout=1) as client:
                client.settimeout(.1)
                try:
                    client.recv(16)
                except TimeoutError:
                    print('Batas waktu baca tercapai')
        finally:
            selesai.set()
    print('Timeout tidak sama dengan bukti perangkat mati')

from concurrent.futures import ThreadPoolExecutor
import socket
from lab_common import local_server, send_frame, recv_frame

def echo(conn):
    send_frame(conn, recv_frame(conn))

def satu_pekerjaan(item):
    nomor, alamat = item
    with socket.create_connection(alamat, timeout=2) as client:
        send_frame(client, str(nomor).encode('ascii'))
        return recv_frame(client).decode('ascii')

if __name__ == '__main__':
    with local_server(echo) as alamat:
        pekerjaan = [(n, alamat) for n in range(1, 4)]
        with ThreadPoolExecutor(max_workers=2) as pool:
            hasil = list(pool.map(satu_pekerjaan, pekerjaan))
    print('Hasil sesuai urutan input:', hasil)
    print('Pekerjaan: 3; worker maksimal: 2')

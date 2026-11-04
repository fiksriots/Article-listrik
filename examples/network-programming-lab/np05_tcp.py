import socket
from concurrent.futures import ThreadPoolExecutor

def layani(listener):
    conn, _ = listener.accept()
    with conn:
        conn.settimeout(2)
        total = 0
        while True:
            chunk = conn.recv(1024)
            if not chunk:
                break
            total += len(chunk)
            if total > 4096:
                raise ValueError('Pesan lab terlalu besar.')
            conn.sendall(chunk)

if __name__ == '__main__':
    # Server dan client dibuat dalam satu program supaya latihan mudah diulang.
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as listener:
        listener.settimeout(2)
        listener.bind(('127.0.0.1', 0))  # OS memilih port kosong.
        listener.listen(1)
        with ThreadPoolExecutor(max_workers=1) as pool:
            tugas = pool.submit(layani, listener)
            with socket.create_connection(listener.getsockname(), timeout=2) as client:
                client.sendall('Halo jaringan'.encode('utf-8'))
                client.shutdown(socket.SHUT_WR)
                hasil = bytearray()
                while True:
                    chunk = client.recv(1024)
                    if not chunk:
                        break
                    hasil.extend(chunk)
                    if len(hasil) > 4096:
                        raise ValueError('Respons terlalu besar.')
            tugas.result(timeout=3)
    print('Balasan:', hasil.decode('utf-8'))

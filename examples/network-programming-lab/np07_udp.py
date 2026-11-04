import socket
from concurrent.futures import ThreadPoolExecutor

def layani(server):
    data, asal = server.recvfrom(1024)
    if len(data) > 100:
        raise ValueError('Batas pesan lab 100 byte.')
    server.sendto(data.upper(), asal)

if __name__ == '__main__':
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as server:
        server.bind(('127.0.0.1', 0))
        server.settimeout(2)
        with ThreadPoolExecutor(max_workers=1) as pool:
            tugas = pool.submit(layani, server)
            with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as client:
                client.settimeout(2)
                client.sendto(b'halo', server.getsockname())
                data, asal = client.recvfrom(1024)
                assert asal == server.getsockname()
            tugas.result(timeout=3)
    print('Datagram balasan:', data.decode('ascii'))
    print('Keberhasilan sekali bukan jaminan pengiriman berikutnya')

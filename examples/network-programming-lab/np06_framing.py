import socket
from lab_common import local_server, recv_frame, send_frame

def echo(conn):
    for _ in range(2):
        send_frame(conn, recv_frame(conn))

if __name__ == '__main__':
    with local_server(echo) as alamat:
        with socket.create_connection(alamat, timeout=2) as client:
            for pesan in ['satu', 'dua']:
                send_frame(client, pesan.encode('utf-8'))
                print('Frame:', recv_frame(client).decode('utf-8'))

import json
import socket
from lab_common import local_server, send_frame, recv_frame

PERANGKAT = {'BTS-LAB': {'status': 'up', 'rtt_ms': 12}}

def jawab(payload):
    request = json.loads(payload.decode('utf-8'))
    if not isinstance(request, dict) or set(request) != {'id', 'aksi', 'perangkat'}:
        raise ValueError('Skema permintaan tidak sesuai.')
    if type(request['id']) is not int or not 1 <= request['id'] <= 9999:
        raise ValueError('ID wajib integer 1..9999.')
    if request['aksi'] != 'status' or not isinstance(request['perangkat'], str):
        raise ValueError('Hanya aksi status dengan nama perangkat teks.')
    data = PERANGKAT.get(request['perangkat'])
    return {'id': request['id'], 'ok': data is not None, 'data': data}

def layani(conn):
    payload = recv_frame(conn)
    try:
        response = jawab(payload)
    except (ValueError, UnicodeError):
        response = {'ok': False, 'error': 'permintaan_invalid'}
    send_frame(conn, json.dumps(response).encode('utf-8'))

if __name__ == '__main__':
    with local_server(layani) as alamat:
        with socket.create_connection(alamat, timeout=2) as client:
            request = {'id': 21, 'aksi': 'status', 'perangkat': 'BTS-LAB'}
            send_frame(client, json.dumps(request).encode('utf-8'))
            response = json.loads(recv_frame(client).decode('utf-8'))
            if response.get('id') != request['id']:
                raise ValueError('ID balasan tidak cocok.')
    print('Balasan:', response)
    print('Data fiktif; layanan hanya membaca status')

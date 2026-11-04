import json

def proses(payload):
    if len(payload) > 4096:
        raise ValueError('Pesan terlalu besar.')
    pesan = json.loads(payload.decode('utf-8'))
    if not isinstance(pesan, dict) or set(pesan) != {'id', 'aksi'}:
        raise ValueError('Kolom wajib tepat id dan aksi.')
    if type(pesan['id']) is not int or not 1 <= pesan['id'] <= 9999 or pesan['aksi'] != 'ping':
        raise ValueError('ID atau aksi tidak valid.')
    return {'id': pesan['id'], 'hasil': 'pong'}

if __name__ == '__main__':
    payload = json.dumps({'id': 7, 'aksi': 'ping'}).encode('utf-8')
    print('Balasan:', proses(payload))
    try:
        proses(b'{"id":true,"aksi":"ping"}')
    except ValueError:
        print('ID boolean ditolak')

import csv
import socket
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from lab_common import local_server
from np14_logging import klasifikasi

def periksa(item):
    nama, alamat = item
    if alamat[0] != '127.0.0.1':
        raise ValueError('Lab hanya menerima endpoint loopback yang ditentukan.')
    try:
        with socket.create_connection(alamat, timeout=1):
            hasil = 'tcp_terhubung'
    except OSError as exc:
        hasil = klasifikasi(exc)
    return {'layanan': nama, 'hasil': hasil}

if __name__ == '__main__':
    with local_server(lambda conn: None) as aktif, socket.socket() as tanpa_listener:
        tanpa_listener.bind(('127.0.0.1', 0))
        # Port kedua dipesan tetapi tidak listen: fixture penolakan lokal.
        endpoint = [('lab-aktif', aktif), ('lab-tutup', tanpa_listener.getsockname())]
        with ThreadPoolExecutor(max_workers=2) as pool:
            hasil = list(pool.map(periksa, endpoint))
    folder = Path('hasil-latihan')
    folder.mkdir(exist_ok=True)
    with (folder / 'cek-layanan.csv').open('w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=['layanan', 'hasil'])
        writer.writeheader()
        writer.writerows(hasil)
    for row in hasil:
        print(row['layanan'] + ':', row['hasil'])
    print('Laporan: hasil-latihan/cek-layanan.csv')

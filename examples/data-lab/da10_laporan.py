import hashlib
import json
from pathlib import Path

def buat_laporan(sumber, folder):
    sumber, folder = Path(sumber), Path(folder)
    folder.mkdir(parents=True, exist_ok=True)
    laporan = {'dataset':'penjualan fiktif', 'sha256':hashlib.sha256(sumber.read_bytes()).hexdigest(),
               'unit':'baris transaksi', 'batas':'Omzet bukan laba; hanya data diterima.',
               'kebijakan':'Duplikat identik dihapus; data invalid dikarantina.'}
    (folder/'metadata-laporan.json').write_text(json.dumps(laporan, ensure_ascii=False, indent=2), encoding='utf-8')
    return laporan

if __name__ == '__main__':
    hasil = buat_laporan(Path(__file__).resolve().parent/'datasets/penjualan.csv','hasil-latihan')
    print('Metadata dibuat:', len(hasil), 'field')
    print('Hash lengkap:', len(hasil['sha256']) == 64)

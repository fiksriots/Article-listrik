"""Aturan murni: tidak membuka file, socket, atau database."""
from collections import Counter
from collections.abc import Mapping

def ringkas(rows):
    """Hitung observasi ok/timeout/refused; kosong menghasilkan rasio None."""
    counts = Counter()
    total = 0
    for row in rows:
        if not isinstance(row, Mapping) or set(row) != {'layanan', 'hasil'}:
            raise ValueError('Kolom wajib tepat layanan dan hasil.')
        if not isinstance(row['layanan'], str) or not row['layanan'].strip():
            raise ValueError('Nama layanan wajib diisi.')
        if row['hasil'] not in ('ok', 'timeout', 'refused'):
            raise ValueError('Hasil belum didukung.')
        counts[row['hasil']] += 1
        total += 1
    return {'total': total, 'ok': counts['ok'], 'timeout': counts['timeout'],
            'refused': counts['refused'], 'rasio_ok': counts['ok']/total if total else None}

def konfigurasi(env):
    raw = env.get('LAB_MAX_ROWS', '1000')
    if not isinstance(raw, str) or not raw.isascii() or not raw.isdecimal():
        raise ValueError('LAB_MAX_ROWS wajib angka bulat 1..10000.')
    value = int(raw)
    if not 1 <= value <= 10000:
        raise ValueError('LAB_MAX_ROWS di luar rentang.')
    return value

def baca_status(fetch):
    """Terima fungsi I/O agar aturan respons dapat diuji tanpa jaringan."""
    response = fetch()
    if not isinstance(response, dict) or set(response) != {'status'} or response['status'] not in ('ok', 'gangguan'):
        raise ValueError('Respons status tidak sesuai kontrak.')
    return response['status']

import hashlib
import json
import sqlite3

def siapkan(conn):
    conn.execute('CREATE TABLE IF NOT EXISTS laporan (nama TEXT PRIMARY KEY, isi TEXT NOT NULL)')
    conn.execute('CREATE TABLE IF NOT EXISTS jobs (kunci TEXT PRIMARY KEY, digest TEXT NOT NULL)')
    conn.commit()

def simpan(conn, nama, summary):
    payload = json.dumps(summary, allow_nan=False, sort_keys=True)
    conn.execute('INSERT INTO laporan VALUES (?,?) ON CONFLICT(nama) DO UPDATE SET isi=excluded.isi', (nama, payload))

def baca(conn, nama='terbaru'):
    row = conn.execute('SELECT isi FROM laporan WHERE nama=?', (nama,)).fetchone()
    return json.loads(row[0]) if row else None

def catat_job(conn, kunci, payload):
    """Demo idempotensi ledger saja; bukan jaminan efek eksternal exactly-once."""
    if not isinstance(kunci, str) or not kunci:
        raise ValueError('Kunci job wajib teks terisi.')
    digest = hashlib.sha256(json.dumps(payload, sort_keys=True, allow_nan=False).encode()).hexdigest()
    with conn:
        added = conn.execute('INSERT OR IGNORE INTO jobs VALUES (?,?)', (kunci, digest)).rowcount == 1
        old = conn.execute('SELECT digest FROM jobs WHERE kunci=?', (kunci,)).fetchone()[0]
        if old != digest:
            raise ValueError('Kunci sama dengan payload berbeda.')
    return added

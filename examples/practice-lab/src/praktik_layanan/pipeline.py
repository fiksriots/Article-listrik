from contextlib import closing
from pathlib import Path
import sqlite3
from .core import ringkas
from .io import baca_csv, tulis_json
from .store import siapkan, simpan

def rencanakan(source, database, output, max_rows=1000):
    paths = [Path(p).resolve() for p in (source, database, output)]
    if len(set(paths)) != 3:
        raise ValueError('Sumber, database, dan keluaran harus berbeda.')
    accepted, rejected = baca_csv(source, max_rows)
    return {**ringkas(accepted), 'ditolak': len(rejected)}

def buat_laporan(source, database, output, max_rows=1000):
    summary = rencanakan(source, database, output, max_rows)
    db = Path(database)
    db.parent.mkdir(parents=True, exist_ok=True)
    with closing(sqlite3.connect(db)) as conn:
        siapkan(conn)
        with conn:
            simpan(conn, 'terbaru', summary)
    # File dan SQLite adalah dua resource: tidak dijanjikan transaksi bersama.
    tulis_json(output, summary)
    return summary

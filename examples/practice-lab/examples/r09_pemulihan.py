from contextlib import closing
from pathlib import Path
import sqlite3
from tempfile import TemporaryDirectory
from praktik_layanan.backup import salin_database
from praktik_layanan.store import siapkan,simpan,baca

with TemporaryDirectory() as work:
    root=Path(work);active=root/'aktif.sqlite'
    with closing(sqlite3.connect(active)) as conn:
        siapkan(conn)
        with conn:simpan(conn,'terbaru',{'total':2})
    snapshot=salin_database(active,root/'backup.sqlite')
    # Simulasikan data aktif berubah sesudah backup.
    with closing(sqlite3.connect(active)) as conn:
        with conn:simpan(conn,'terbaru',{'total':99})
    restored=salin_database(snapshot,root/'pulih.sqlite')
    with closing(sqlite3.connect(restored)) as conn:
        print('Total dipulihkan:',baca(conn)['total'])
        print('Integrity check:',conn.execute('PRAGMA integrity_check').fetchone()[0])
    with closing(sqlite3.connect(active)) as conn:
        print('Database aktif tetap:',baca(conn)['total'])
    print('Pemulihan diverifikasi pada file baru, belum mengganti database aktif')

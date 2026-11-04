"""Salin SQLite lewat API backup ke file baru milik lab; tidak menimpa file."""
from contextlib import closing
from pathlib import Path
import os
import sqlite3

def salin_database(source, destination):
    source, destination = Path(source).resolve(), Path(destination).resolve()
    if source == destination:
        raise ValueError('Sumber dan tujuan harus berbeda.')
    # Parent harus sudah ada. O_EXCL menolak tujuan yang sudah tersedia.
    fd = os.open(destination, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    os.close(fd)
    done = False
    try:
        with closing(sqlite3.connect(source.as_uri()+'?mode=ro', uri=True, timeout=2)) as src:
            with closing(sqlite3.connect(destination, timeout=2)) as dst:
                src.backup(dst, pages=64, sleep=.01)
                check = dst.execute('PRAGMA integrity_check').fetchall()
                if check != [('ok',)]:
                    raise ValueError('Salinan gagal pemeriksaan struktur SQLite.')
        done = True
    finally:
        if not done:
            destination.unlink(missing_ok=True)
    return destination

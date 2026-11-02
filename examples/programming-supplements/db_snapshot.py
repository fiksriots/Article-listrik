from pathlib import Path
from tempfile import TemporaryDirectory
import sqlite3


def demo():
    with TemporaryDirectory() as folder:
        path = str(Path(folder) / 'latihan.sqlite3')
        a = sqlite3.connect(path, isolation_level=None, timeout=0)
        b = sqlite3.connect(path, isolation_level=None, timeout=0)
        try:
            mode = a.execute('PRAGMA journal_mode=WAL').fetchone()[0]
            if mode != 'wal':
                raise RuntimeError('Latihan memerlukan mode WAL pada disk lokal.')
            a.execute('CREATE TABLE nilai(id INTEGER PRIMARY KEY, angka INTEGER)')
            a.execute('INSERT INTO nilai VALUES (1, 10)')
            a.execute('BEGIN')
            print('A awal:', a.execute('SELECT angka FROM nilai').fetchone()[0])
            b.execute('UPDATE nilai SET angka=20 WHERE id=1')
            print('A snapshot:', a.execute('SELECT angka FROM nilai').fetchone()[0])
            a.execute('COMMIT')
            print('A transaksi baru:', a.execute('SELECT angka FROM nilai').fetchone()[0])
        finally:
            a.close()
            b.close()


if __name__ == '__main__':
    demo()

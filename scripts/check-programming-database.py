"""Validate SQL examples and application rules on isolated SQLite databases."""
import contextlib
import io
import json
from pathlib import Path
import runpy
import sqlite3
import tempfile
from programming_sql_runner import statements, run_sql

root = Path(__file__).resolve().parents[1]
lessons = json.loads((root / 'lib/programming-database-lessons.json').read_text())
assert len(lessons) == 31
by_slug = {lesson['slug']: lesson for lesson in lessons}

def sql(slug):
    con = sqlite3.connect(':memory:', isolation_level=None)
    for statement in statements(by_slug[slug]['blocks'][0]['code']):
        con.execute(statement).fetchall()
    return con

def reject(operation, kind=sqlite3.IntegrityError):
    try:
        operation()
    except kind:
        return
    raise AssertionError('Invalid operation accepted')

for lesson in lessons:
    block = lesson['blocks'][0]
    if block['language'] == 'sql':
        assert run_sql(block['code']).strip() == block['output'].strip(), lesson['slug']
con = sql('db-create-tipe')
try:
    for name, price, stock in [('', 1, 0), (' ', 1, 0), (None, 1, 0), ('X', -1, 0), ('X', 1, -1), ('X', 1, 2.5), ('X', 1, None), ('X', 1, 'invalid')]:
        reject(lambda: con.execute('INSERT INTO barang (nama, harga, stok) VALUES (?, ?, ?)', (name, price, stock)))
    assert con.execute('SELECT COUNT(*) FROM barang').fetchone()[0] == 1
finally:
    con.close()
con = sql('db-integritas')
try:
    assert con.execute('PRAGMA foreign_keys').fetchone()[0] == 1
    reject(lambda: con.execute("INSERT INTO tiket VALUES (2, 99, 'BARU')"))
    reject(lambda: con.execute("INSERT INTO tiket VALUES (2, 1, 'INVALID')"))
    reject(lambda: con.execute('DELETE FROM teknisi WHERE id = 1'))
    assert con.execute('PRAGMA foreign_key_check').fetchall() == []
finally:
    con.close()
con = sql('db-transaksi')
try:
    assert con.execute('SELECT gudang, jumlah FROM stok ORDER BY gudang').fetchall() == [('A', 3), ('B', 3)]
    con.execute('BEGIN')
    con.execute("UPDATE stok SET jumlah = jumlah - 1 WHERE gudang = 'A'")
    reject(lambda: con.execute("UPDATE stok SET jumlah = -1 WHERE gudang = 'B'"))
    con.execute('ROLLBACK')
    assert con.execute('SELECT SUM(jumlah) FROM stok').fetchone()[0] == 6
finally:
    con.close()

with tempfile.TemporaryDirectory() as directory:
    folder = Path(directory)
    def load(slug):
        path = folder / (slug + '.py')
        path.write_text(by_slug[slug]['blocks'][0]['code'])
        with contextlib.redirect_stdout(io.StringIO()):
            return runpy.run_path(str(path), run_name='lesson')

    migration = load('db-migrasi-backup')['migrasi']
    con = sqlite3.connect(':memory:', isolation_level=None)
    con.execute('CREATE TABLE tiket (id INTEGER PRIMARY KEY, judul TEXT)')
    con.execute("INSERT INTO tiket VALUES (1, 'X')")
    assert migration(con) is True and migration(con) is False
    assert con.execute('SELECT prioritas FROM tiket').fetchone()[0] == 'NORMAL'
    con.execute('PRAGMA user_version = 2')
    reject(lambda: migration(con), ValueError)
    con.close()
    con = sqlite3.connect(':memory:', isolation_level=None)
    con.execute('CREATE TABLE tiket (id INTEGER PRIMARY KEY, prioritas TEXT)')
    reject(lambda: migration(con), sqlite3.OperationalError)
    assert con.execute('PRAGMA user_version').fetchone()[0] == 0 and not con.in_transaction
    con.close()
    # Backup is reopened independently, rather than trusted just because a file exists.
    src = sqlite3.connect(folder / 'source.db', isolation_level=None)
    dst = sqlite3.connect(folder / 'backup.db', isolation_level=None)
    src.execute('CREATE TABLE data (id INTEGER PRIMARY KEY, nilai TEXT)')
    src.execute('INSERT INTO data VALUES (?, ?)', (1, "O'Neil"))
    src.backup(dst)
    src.execute("UPDATE data SET nilai = 'Berubah'")
    src.close(); dst.close()
    restored = sqlite3.connect(folder / 'backup.db')
    assert restored.execute('SELECT nilai FROM data').fetchone()[0] == "O'Neil"
    assert restored.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
    restored.close()

    library = load('db-kasus-perpustakaan')
    con = sqlite3.connect(':memory:', isolation_level=None)
    try:
        library['siapkan'](con)
        con.executemany('INSERT INTO anggota VALUES (?, ?)', [(1, 'A'), (2, 'B')])
        con.executemany('INSERT INTO buku VALUES (?, ?)', [(1, 'Python'), (2, 'SQL')])
        first = library['pinjam'](con, 1, 1)
        for member, book in [(1, 1), (2, 1), (99, 2), (1, 99)]:
            reject(lambda: library['pinjam'](con, member, book))
            assert not con.in_transaction
        assert con.execute('SELECT COUNT(*) FROM pinjaman').fetchone()[0] == 1
        for date in ('', '2026-02-30', '20260102', None):
            reject(lambda: library['kembalikan'](con, first, date), ValueError)
        library['kembalikan'](con, first, '2026-01-02')
        reject(lambda: library['kembalikan'](con, first, '2026-01-03'), ValueError)
        second = library['pinjam'](con, 2, 1)
        assert second != first
        assert con.execute('SELECT COUNT(*) FROM pinjaman WHERE kembali IS NULL').fetchone()[0] == 1
        assert con.execute('PRAGMA foreign_key_check').fetchall() == []
    finally:
        con.close()

    tickets = load('db-kasus-tiket')
    con = sqlite3.connect(':memory:', isolation_level=None)
    try:
        tickets['siapkan'](con)
        con.execute('INSERT INTO teknisi VALUES (1, ?)', ('Ana',))
        tickets['buat'](con, 1, ' Gangguan ')
        def snapshot():
            return (con.execute('SELECT * FROM tiket ORDER BY id').fetchall(),
                    con.execute('SELECT * FROM riwayat ORDER BY id').fetchall())
        before = snapshot()
        reject(lambda: tickets['buat'](con, 1, 'Duplikat'))
        for target, technician in [('SELESAI', None), ('DIPROSES', None), ('INVALID', 1)]:
            reject(lambda: tickets['ubah'](con, 1, target, technician), ValueError)
            assert snapshot() == before and not con.in_transaction
        reject(lambda: tickets['ubah'](con, 1, 'DIPROSES', 99))
        assert snapshot() == before
        reject(lambda: tickets['ubah'](con, 99, 'DIPROSES', 1), ValueError)
        # Force the second write to fail; the preceding status change must roll back.
        con.execute("CREATE TRIGGER tolak_riwayat BEFORE INSERT ON riwayat WHEN NEW.status = 'DIPROSES' BEGIN SELECT RAISE(ABORT, 'test failure'); END")
        reject(lambda: tickets['ubah'](con, 1, 'DIPROSES', 1))
        assert snapshot() == before and not con.in_transaction
        con.execute('DROP TRIGGER tolak_riwayat')
        tickets['ubah'](con, 1, 'DIPROSES', 1)
        tickets['ubah'](con, 1, 'SELESAI')
        before = snapshot()
        reject(lambda: tickets['ubah'](con, 1, 'SELESAI'), ValueError)
        assert snapshot() == before
        assert [row[0] for row in con.execute('SELECT status FROM riwayat ORDER BY id')] == ['BARU', 'DIPROSES', 'SELESAI']
        assert con.execute('PRAGMA foreign_key_check').fetchall() == []
    finally:
        con.close()
print('PASS: 31 database examples, constraints, FK enforcement, rollback atomicity, migration failures, backup restore, active loan uniqueness and ticket/history consistency')

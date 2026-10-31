"""Exercise advanced SQL semantics, concurrency and idempotent stock operations."""
import contextlib
import io
import json
from pathlib import Path
import random
import runpy
import sqlite3
import tempfile
from programming_sql_runner import statements

root = Path(__file__).resolve().parents[1]
lessons = json.loads((root / 'lib/programming-database-lessons.json').read_text())
by_slug = {x['slug']: x for x in lessons}
assert sqlite3.sqlite_version_info >= (3, 25, 0)
order = json.loads((root / 'lib/programming-order.json').read_text())
slugs = [slug for g in order if g['title'].startswith('Basis Data ·') for slug in g['slugs']]
assert len(slugs) == len(set(slugs)) == 31
for early, late in [('db-select-filter', 'db-subquery-exists'), ('db-subquery-exists', 'db-cte'),
                    ('db-cte', 'db-cte-rekursif'), ('db-agregasi', 'db-window'),
                    ('db-transaksi', 'db-trigger'), ('db-parameter', 'db-konkurensi'),
                    ('db-window', 'db-kasus-dashboard'), ('db-upsert', 'db-kasus-stok-atomik')]:
    assert slugs.index(early) < slugs.index(late)

def load_sql(slug):
    con = sqlite3.connect(':memory:', isolation_level=None)
    query = None
    for statement in statements(by_slug[slug]['blocks'][0]['code']):
        con.execute(statement).fetchall()
        query = statement
    return con, query

def reject(operation, kind=ValueError):
    try:
        operation()
    except kind as error:
        return error
    raise AssertionError('Expected rejection')

con, query = load_sql('db-subquery-exists')
try:
    assert con.execute(query).fetchall() == [('Budi',), ('Citra',)]
    assert con.execute('SELECT id FROM teknisi WHERE id NOT IN (SELECT teknisi_id FROM tiket)').fetchall() == []
finally:
    con.close()
con, query = load_sql('db-cte-rekursif')
try:
    rng = random.Random(81)
    for _ in range(35):
        nodes = ['A', 'B', 'C', 'D', 'E']
        edges = [(a, b) for a in nodes for b in nodes if rng.randrange(4) == 0]
        con.execute('DELETE FROM edge')
        con.executemany('INSERT INTO edge VALUES (?, ?)', edges)
        visited, pending = {'A'}, ['A']
        while pending:
            node = pending.pop()
            for a, b in edges:
                if a == node and b not in visited:
                    visited.add(b); pending.append(b)
        assert {row[0] for row in con.execute(query)} == visited
finally:
    con.close()
con, query = load_sql('db-window')
try:
    assert con.execute(query).fetchall() == [('Ana', 1, 1, 5), ('Budi', 2, 1, 10), ('Citra', 3, 3, 12)]
    con.execute('UPDATE kinerja SET selesai = 0')
    rows = con.execute(query).fetchall()
    assert [r[2] for r in rows] == [1, 1, 1] and [r[3] for r in rows] == [0, 0, 0]
finally:
    con.close()
con, query = load_sql('db-pagination')
try:
    for size in (1, 2, 3, 5):
        accumulated = []
        cursor = ('', 0)
        while True:
            page = con.execute('SELECT id, dibuat FROM tiket WHERE dibuat > ? OR (dibuat = ? AND id > ?) ORDER BY dibuat, id LIMIT ?',
                               (cursor[0], cursor[0], cursor[1], size)).fetchall()
            if not page:
                break
            accumulated.extend(page)
            cursor = (page[-1][1], page[-1][0])
        assert accumulated == con.execute('SELECT id, dibuat FROM tiket ORDER BY dibuat, id').fetchall()
finally:
    con.close()
con, query = load_sql('db-trigger')
try:
    reject(lambda: con.execute("INSERT INTO tiket VALUES (2, 'SELESAI')"), sqlite3.IntegrityError)
    con.execute("INSERT INTO tiket VALUES (2, 'BARU')")
    before = con.execute('SELECT * FROM riwayat ORDER BY id').fetchall()
    reject(lambda: con.execute("UPDATE tiket SET status = 'SELESAI' WHERE id = 2"), sqlite3.IntegrityError)
    assert con.execute('SELECT status FROM tiket WHERE id = 2').fetchone()[0] == 'BARU'
    assert con.execute('SELECT * FROM riwayat ORDER BY id').fetchall() == before
    con.execute("UPDATE tiket SET status = 'DIPROSES' WHERE id = 2")
    con.execute("UPDATE tiket SET status = 'DIPROSES' WHERE id = 2")
    assert con.execute('SELECT COUNT(*) FROM riwayat WHERE tiket_id = 2').fetchone()[0] == 2
    reject(lambda: con.execute("UPDATE tiket SET status = 'BARU' WHERE id = 2"), sqlite3.IntegrityError)
    assert con.execute('PRAGMA foreign_key_check').fetchall() == []
finally:
    con.close()
con, query = load_sql('db-upsert')
try:
    query_upsert = list(statements(by_slug['db-upsert']['blocks'][0]['code']))[2]
    con.execute(query_upsert)
    assert con.execute('SELECT suhu FROM suhu_terakhir').fetchone()[0] == 30
finally:
    con.close()
con, query = load_sql('db-kasus-dashboard')
try:
    assert con.execute(query).fetchall() == [('2026-01-01', 2, 1, 2), ('2026-01-02', 0, 0, 2), ('2026-01-03', 1, 1, 3)]
    con.execute("INSERT INTO tiket VALUES (4, '2026-01-04 00:00:00', 'BARU')")
    assert sum(row[1] for row in con.execute(query)) == 3
    con.execute("UPDATE tiket SET status = 'BARU' WHERE id = 1")
    assert con.execute(query).fetchone() == ('2026-01-01', 2, 0, 2)
finally:
    con.close()

with tempfile.TemporaryDirectory() as directory:
    folder = Path(directory)
    source = folder / 'stock.py'
    source.write_text(by_slug['db-kasus-stok-atomik']['blocks'][0]['code'])
    module = runpy.run_path(str(source), run_name='lesson')
    setup, reserve = module['siapkan'], module['reservasi']
    path = folder / 'stock.db'
    a = sqlite3.connect(path, isolation_level=None, timeout=0)
    b = sqlite3.connect(path, isolation_level=None, timeout=0)
    try:
        setup(a)
        b.execute('PRAGMA foreign_keys = ON')
        a.execute('INSERT INTO barang VALUES (1, 100)')
        assert reserve(a, ' R01 ', 1, 2) is True
        assert reserve(b, 'R01', 1, 2) is False
        for bad in [('', 1, 1), (None, 1, 1), ('X', True, 1), ('X', 1, True), ('X', 1, 0), ('X', 1, -1), ('X', 1, 1.5)]:
            reject(lambda: reserve(a, *bad))
            assert not a.in_transaction
        reject(lambda: reserve(b, 'R01', 1, 3))
        reject(lambda: reserve(b, 'missing', 99, 1))
        a.execute('BEGIN IMMEDIATE')
        error = reject(lambda: reserve(b, 'busy', 1, 1), sqlite3.OperationalError)
        assert error.sqlite_errorcode == sqlite3.SQLITE_BUSY and not b.in_transaction
        a.execute('ROLLBACK')
        # If recording fails after stock UPDATE, all effects must be rolled back.
        a.execute("CREATE TRIGGER fail_request BEFORE INSERT ON permintaan WHEN NEW.kode = 'FAIL' BEGIN SELECT RAISE(ABORT, 'test'); END")
        before = a.execute('SELECT stok FROM barang WHERE id = 1').fetchone()[0]
        reject(lambda: reserve(a, 'FAIL', 1, 1), sqlite3.IntegrityError)
        assert a.execute('SELECT stok FROM barang WHERE id = 1').fetchone()[0] == before
        assert a.execute("SELECT COUNT(*) FROM permintaan WHERE kode = 'FAIL'").fetchone()[0] == 0
        assert not a.in_transaction
        a.execute('DROP TRIGGER fail_request')
        expected_stock, ledger = 98, {'R01': (1, 2)}
        rng = random.Random(45)
        for _ in range(100):
            code, quantity = 'Q' + str(rng.randrange(15)), rng.randrange(1, 13)
            if code in ledger:
                if ledger[code] == (1, quantity):
                    assert reserve(b, code, 1, quantity) is False
                else:
                    reject(lambda: reserve(b, code, 1, quantity))
            elif quantity <= expected_stock:
                assert reserve(b, code, 1, quantity) is True
                ledger[code] = (1, quantity)
                expected_stock -= quantity
            else:
                reject(lambda: reserve(b, code, 1, quantity))
            assert a.execute('SELECT stok FROM barang WHERE id = 1').fetchone()[0] == expected_stock
            assert a.execute('SELECT COUNT(*) FROM permintaan').fetchone()[0] == len(ledger)
        if expected_stock:
            assert reserve(a, 'EMPTY', 1, expected_stock) is True
        assert a.execute('SELECT stok FROM barang').fetchone()[0] == 0
        reject(lambda: reserve(b, 'EXCESS', 1, 1))
        assert a.execute('PRAGMA foreign_key_check').fetchall() == []
    finally:
        a.close(); b.close()
    restored = sqlite3.connect(path)
    assert restored.execute('SELECT stok FROM barang').fetchone()[0] == 0
    assert restored.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
    restored.close()
print('PASS: advanced ordering, NULL anti-joins, recursive reachability vs graph reference, window ties, pagination, trigger enforcement, dashboard semantics, two-writer conflict, idempotency model and rollback consistency')

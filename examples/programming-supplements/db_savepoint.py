import sqlite3


def impor_baris(con, data):
    ditolak = []
    con.execute('BEGIN')
    try:
        for kode, jumlah in data:
            con.execute('SAVEPOINT satu_baris')
            try:
                con.execute('INSERT INTO stok VALUES (?, ?)', (kode, jumlah))
            except sqlite3.IntegrityError:
                con.execute('ROLLBACK TO satu_baris')
                ditolak.append(kode)
            finally:
                con.execute('RELEASE satu_baris')
        con.commit()
    except Exception:
        con.rollback()
        raise
    return ditolak


if __name__ == '__main__':
    con = sqlite3.connect(':memory:', isolation_level=None)
    try:
        con.execute('CREATE TABLE stok(kode TEXT PRIMARY KEY, jumlah INTEGER NOT NULL CHECK(jumlah >= 0))')
        print('Ditolak:', impor_baris(con, [('A', 2), ('B', -1), ('C', 4)]))
        print(con.execute('SELECT kode, jumlah FROM stok ORDER BY kode').fetchall())
    finally:
        con.close()

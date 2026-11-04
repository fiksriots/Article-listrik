from contextlib import closing
import sqlite3
import pytest
from praktik_layanan.store import siapkan,simpan,baca

def test_persistensi_setelah_koneksi_ditutup(tmp_path):
    db=tmp_path/'uji.sqlite'
    with closing(sqlite3.connect(db)) as conn:
        siapkan(conn)
        with conn:simpan(conn,'terbaru',{'total':2})
    with closing(sqlite3.connect(db)) as conn:
        assert baca(conn)=={'total':2}

def test_rollback_transaksi():
    with closing(sqlite3.connect(':memory:')) as conn:
        siapkan(conn)
        with pytest.raises(RuntimeError):
            with conn:
                simpan(conn,'terbaru',{'total':9})
                raise RuntimeError('gagal sebelum commit')
        assert baca(conn) is None

def test_parameter_sql():
    with closing(sqlite3.connect(':memory:')) as conn:
        siapkan(conn)
        with conn:simpan(conn,"x' OR 1=1 --",{'total':1})
        assert baca(conn) is None
        assert baca(conn,"x' OR 1=1 --")=={'total':1}

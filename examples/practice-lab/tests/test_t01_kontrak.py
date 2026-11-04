from praktik_layanan.core import ringkas

def test_total_observasi_bukan_layanan_unik():
    rows=[{'layanan':'a','hasil':'ok'},{'layanan':'a','hasil':'timeout'}]
    assert ringkas(rows)['total']==2

def test_rasio_sampel():
    rows=[{'layanan':'a','hasil':'ok'},{'layanan':'b','hasil':'refused'}]
    assert ringkas(rows)['rasio_ok']==.5

def test_tidak_ada_observasi():
    assert ringkas([])['rasio_ok'] is None

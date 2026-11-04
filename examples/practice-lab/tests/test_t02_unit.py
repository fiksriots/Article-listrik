from praktik_layanan.core import ringkas

def test_semua_jenis_hasil():
    rows=[{'layanan':'a','hasil':x} for x in ['ok','ok','timeout','refused']]
    assert ringkas(rows)=={'total':4,'ok':2,'timeout':1,'refused':1,'rasio_ok':.5}

def test_input_tetap():
    rows=[{'layanan':'a','hasil':'ok'}]
    ringkas(rows)
    assert rows==[{'layanan':'a','hasil':'ok'}]

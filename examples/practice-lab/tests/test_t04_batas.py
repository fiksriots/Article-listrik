import pytest
from praktik_layanan.core import ringkas,konfigurasi

@pytest.mark.parametrize('row',[{},None,{'layanan':'','hasil':'ok'},{'layanan':'a','hasil':'asing'},{'layanan':'a','hasil':'ok','rahasia':'x'}])
def test_input_invalid(row):
    with pytest.raises(ValueError):ringkas([row])

@pytest.mark.parametrize('raw',['0','10001','-1','1.5','True'])
def test_konfigurasi_invalid(raw):
    with pytest.raises(ValueError):konfigurasi({'LAB_MAX_ROWS':raw})

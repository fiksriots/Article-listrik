import pytest
from praktik_layanan.core import ringkas

@pytest.fixture
def observasi():
    return [{'layanan':'lab','hasil':'ok'},{'layanan':'lab','hasil':'timeout'}]

@pytest.mark.parametrize('kolom,harapan',[('total',2),('ok',1),('timeout',1)])
def test_ringkasan(observasi,kolom,harapan):
    assert ringkas(observasi)[kolom]==harapan

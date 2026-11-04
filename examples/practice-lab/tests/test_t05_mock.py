from unittest.mock import Mock
import pytest
from praktik_layanan.core import baca_status

def test_respons_tanpa_koneksi():
    fetch=Mock(return_value={'status':'ok'})
    assert baca_status(fetch)=='ok'
    fetch.assert_called_once_with()

def test_error_transport_tidak_diubah_jadi_sehat():
    fetch=Mock(side_effect=TimeoutError('batas tunggu'))
    with pytest.raises(TimeoutError):baca_status(fetch)

def test_mock_tetap_menguji_kontrak():
    with pytest.raises(ValueError):baca_status(Mock(return_value={'status':'asing'}))

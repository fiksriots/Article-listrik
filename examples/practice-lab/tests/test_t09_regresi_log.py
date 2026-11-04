import logging
import pytest
from praktik_layanan.observasi import ringkas_tercatat

def test_regresi_kosong_bukan_nol(caplog):
    logger=logging.getLogger('uji-regresi')
    with caplog.at_level(logging.INFO,logger=logger.name):
        result=ringkas_tercatat([],logger)
    assert result['rasio_ok'] is None
    record=caplog.records[-1]
    assert record.getMessage()=='ringkasan_selesai'
    assert record.total==0

def test_invalid_tidak_dicatat_sebagai_sukses(caplog):
    logger=logging.getLogger('uji-invalid')
    with caplog.at_level(logging.INFO,logger=logger.name):
        with pytest.raises(ValueError):
            ringkas_tercatat([{'layanan':'lab','hasil':'asing'}],logger)
    assert [(r.levelno,r.getMessage()) for r in caplog.records]==[(logging.WARNING,'ringkasan_invalid')]

def test_nama_sumber_tidak_bocor_ke_record(caplog):
    logger=logging.getLogger('uji-minim-data')
    with caplog.at_level(logging.INFO,logger=logger.name):
        ringkas_tercatat([{'layanan':'contoh-identitas-fiktif','hasil':'ok'}],logger)
    assert 'contoh-identitas-fiktif' not in str([r.__dict__ for r in caplog.records])

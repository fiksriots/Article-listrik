from contextlib import closing
import json
from pathlib import Path
import sqlite3
import subprocess
import sys
from threading import Thread
from urllib.error import HTTPError
from urllib.request import build_opener,ProxyHandler
import pytest
from praktik_layanan import pipeline,io
from praktik_layanan.pipeline import buat_laporan
from praktik_layanan.store import siapkan,baca,catat_job
from praktik_layanan.web import buat_server

@pytest.fixture
def source(tmp_path):
    path=tmp_path/'input.csv'
    path.write_text('layanan,hasil\na,ok\nb,timeout\na,ok\nc,refused\nd,asing\n')
    return path

def test_csv_karantina_dan_sumber_tetap(source):
    before=source.read_bytes()
    accepted,rejected=io.baca_csv(source)
    assert len(accepted)==4 and rejected==[6]
    assert source.read_bytes()==before

def test_csv_batas_header_dan_kolom(source,tmp_path):
    with pytest.raises(ValueError):io.baca_csv(source,max_rows=4)
    bad=tmp_path/'bad.csv';bad.write_text('hasil,layanan\nok,a\n')
    with pytest.raises(ValueError):io.baca_csv(bad)
    bad.write_text('layanan,hasil\na,ok,lebih\nb\n')
    assert io.baca_csv(bad)==([],[2,3])

def test_atomic_replace_gagal_mempertahankan_file(tmp_path,monkeypatch):
    target=tmp_path/'hasil.json';target.write_text('lama')
    def fail(*args):raise OSError('gagal replace')
    monkeypatch.setattr(io.os,'replace',fail)
    with pytest.raises(OSError):io.tulis_json(target,{'total':2})
    assert target.read_text()=='lama'
    assert list(tmp_path.iterdir())==[target]

def test_pipeline_dan_ulangan(source,tmp_path):
    db=tmp_path/'db.sqlite';output=tmp_path/'hasil.json'
    result=buat_laporan(source,db,output)
    assert result=={'total':4,'ok':2,'timeout':1,'refused':1,'rasio_ok':.5,'ditolak':1}
    assert buat_laporan(source,db,output)==result
    assert json.loads(output.read_text())==result
    with closing(sqlite3.connect(db)) as conn:
        assert baca(conn)==result
        assert conn.execute('SELECT COUNT(*) FROM laporan').fetchone()==(1,)

def test_pipeline_menolak_output_sama_dengan_input(source,tmp_path):
    before=source.read_bytes()
    with pytest.raises(ValueError):buat_laporan(source,tmp_path/'db.sqlite',source)
    assert source.read_bytes()==before

def test_dua_resource_tidak_diklaim_satu_transaksi(source,tmp_path,monkeypatch):
    db=tmp_path/'db.sqlite';output=tmp_path/'hasil.json';output.write_text('lama')
    def fail(*args):raise OSError('disk gagal')
    monkeypatch.setattr(pipeline,'tulis_json',fail)
    with pytest.raises(OSError):buat_laporan(source,db,output)
    assert output.read_text()=='lama'
    with closing(sqlite3.connect(db)) as conn:assert baca(conn)['total']==4

def test_idempotensi_dan_konflik_payload():
    with closing(sqlite3.connect(':memory:')) as conn:
        siapkan(conn)
        assert catat_job(conn,'job-1',{'total':2}) is True
        assert catat_job(conn,'job-1',{'total':2}) is False
        with pytest.raises(ValueError):catat_job(conn,'job-1',{'total':3})
        assert conn.execute('SELECT COUNT(*) FROM jobs').fetchone()==(1,)

def test_http_dashboard_api_error_dan_baca_saja(source,tmp_path):
    db=tmp_path/'db.sqlite';expected=buat_laporan(source,db,tmp_path/'hasil.json')
    with buat_server(db) as server:
        thread=Thread(target=server.serve_forever,kwargs={'poll_interval':.02});thread.start()
        root='http://127.0.0.1:'+str(server.server_port);opener=build_opener(ProxyHandler({}))
        try:
            with opener.open(root+'/',timeout=2) as response:
                html=response.read().decode();assert 'Dashboard Layanan Fiktif' in html
                assert "fetch('/api/ringkasan')" in html and '.textContent' in html
            with opener.open(root+'/api/ringkasan',timeout=2) as response:assert json.load(response)==expected
            with pytest.raises(HTTPError) as err:opener.open(root+'/hilang',timeout=2)
            with err.value:assert err.value.code==404
            with pytest.raises(HTTPError) as err:opener.open(root+'/api/ringkasan',data=b'{}',timeout=2)
            with err.value:assert err.value.code==501
        finally:server.shutdown();thread.join(timeout=3)
    with closing(sqlite3.connect(db)) as conn:assert baca(conn)==expected

def test_api_tanpa_db_tidak_membuat_file(tmp_path):
    db=tmp_path/'belum.sqlite'
    with buat_server(db) as server:
        thread=Thread(target=server.serve_forever,kwargs={'poll_interval':.02});thread.start()
        opener=build_opener(ProxyHandler({}))
        try:
            with pytest.raises(HTTPError) as err:opener.open('http://127.0.0.1:'+str(server.server_port)+'/api/ringkasan',timeout=2)
            with err.value:assert err.value.code==503
        finally:server.shutdown();thread.join(timeout=3)
    assert not db.exists()

def test_cli_dari_direktori_lain(source,tmp_path):
    db=tmp_path/'db.sqlite';output=tmp_path/'hasil.json'
    run=subprocess.run([sys.executable,'-m','praktik_layanan.cli','build-report','--input',str(source),'--db',str(db),'--output',str(output)],cwd=tmp_path,capture_output=True,text=True,timeout=10)
    assert run.returncode==0 and json.loads(run.stdout)['total']==4

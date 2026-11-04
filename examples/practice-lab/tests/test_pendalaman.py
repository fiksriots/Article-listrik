from contextlib import closing
import json
import os
import sqlite3
import subprocess
import sys
import pytest
from praktik_layanan.backup import salin_database
from praktik_layanan.store import siapkan,simpan,baca

@pytest.fixture
def source(tmp_path):
    path=tmp_path/'input.csv';path.write_text('layanan,hasil\na,ok\nb,refused\n')
    return path

def command(source,tmp_path):
    return [sys.executable,'-m','praktik_layanan.cli','build-report','--input',str(source),'--db',str(tmp_path/'output/db.sqlite'),'--output',str(tmp_path/'output/hasil.json'),'--dry-run']

def test_dry_run_tanpa_efek_tulis(source,tmp_path):
    before=source.read_bytes()
    result=subprocess.run(command(source,tmp_path),capture_output=True,text=True,timeout=5)
    assert result.returncode==0
    assert json.loads(result.stdout)['ringkasan']['total']==2
    assert not (tmp_path/'output').exists() and source.read_bytes()==before

def test_dry_run_salah_header_tetap_gagal(source,tmp_path):
    source.write_text('hasil,layanan\nok,a\n')
    result=subprocess.run(command(source,tmp_path),capture_output=True,text=True,timeout=5)
    assert result.returncode==2 and result.stdout=='' and not (tmp_path/'output').exists()

def test_dry_run_validasi_path(source,tmp_path):
    cmd=command(source,tmp_path);cmd[cmd.index('--output')+1]=str(source)
    result=subprocess.run(cmd,capture_output=True,text=True,timeout=5)
    assert result.returncode==2 and not (tmp_path/'output').exists()

def test_dry_run_konfigurasi_invalid(source,tmp_path):
    result=subprocess.run(command(source,tmp_path),env={**os.environ,'LAB_MAX_ROWS':'0'},capture_output=True,text=True,timeout=5)
    assert result.returncode==2 and not (tmp_path/'output').exists()

def test_backup_dan_pemulihan_ke_file_baru(tmp_path):
    active=tmp_path/'aktif.sqlite'
    with closing(sqlite3.connect(active)) as conn:
        siapkan(conn)
        with conn:simpan(conn,'terbaru',{'total':2})
    backup=salin_database(active,tmp_path/'backup.sqlite')
    with closing(sqlite3.connect(active)) as conn:
        with conn:simpan(conn,'terbaru',{'total':99})
    restored=salin_database(backup,tmp_path/'pulih.sqlite')
    with closing(sqlite3.connect(restored)) as conn:
        assert baca(conn)=={'total':2}
        assert conn.execute('PRAGMA integrity_check').fetchall()==[('ok',)]
    with closing(sqlite3.connect(active)) as conn:assert baca(conn)=={'total':99}

def test_backup_tidak_menimpa_dan_bersihkan_gagal(tmp_path):
    target=tmp_path/'existing.sqlite';target.write_bytes(b'jangan ditimpa')
    with pytest.raises(FileExistsError):salin_database(tmp_path/'hilang.sqlite',target)
    assert target.read_bytes()==b'jangan ditimpa'
    with pytest.raises(sqlite3.Error):salin_database(tmp_path/'hilang.sqlite',tmp_path/'gagal.sqlite')
    assert not (tmp_path/'gagal.sqlite').exists() and not (tmp_path/'hilang.sqlite').exists()

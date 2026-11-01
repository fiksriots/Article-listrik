"""Exercise the taught API, ORM and SQL privileges. Use an isolated test DB only.
Install requirements-programming-server.txt. Set COURSE_PGLITE_BIN for local WASM
PostgreSQL testing or COURSE_PG_TEST_DSN to a dedicated native test database.
PGlite validates PostgreSQL SQL and wire-client integration, not native server
concurrency, password authentication, or deployment topology.
"""
import contextlib
import copy
import io
import json
import os
from pathlib import Path
import runpy
import sys
import tempfile
import time
import unittest
import psycopg
from sqlalchemy import create_engine, event, select, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session
from fastapi.testclient import TestClient
from programming_postgres_runner import postgres_dsn, run_postgres

root = Path(__file__).resolve().parents[1]
sources = ['programming-extended-lessons.json','programming-database-lessons.json','programming-oop-lessons.json','programming-api-lessons.json']
by_slug = {x['slug']: x for file in sources for x in json.loads((root/'lib'/file).read_text())}

def reject(operation, kind=ValueError):
    try:
        operation()
    except kind:
        return
    raise AssertionError('Expected rejection')

with tempfile.TemporaryDirectory() as folder:
    folder = Path(folder)
    def load(slug):
        code = next(b['code'] for b in by_slug[slug]['blocks'] if b.get('language','python')=='python')
        path = folder / (slug.replace('-','_')+'.py')
        path.write_text(code)
        name = path.stem
        # Register the module for ORM/Pydantic runtime introspection.
        import importlib.util
        spec = importlib.util.spec_from_file_location(name, path)
        module = importlib.util.module_from_spec(spec)
        sys.modules[name] = module
        with contextlib.redirect_stdout(io.StringIO()):
            spec.loader.exec_module(module)
        return module

    cfg = load('konfigurasi-aplikasi')
    assert cfg.baca_konfigurasi({'PAGE_SIZE':'1'})['page_size']==1
    assert cfg.baca_konfigurasi({'PAGE_SIZE':'100'})['page_size']==100
    for data in ({'PAGE_SIZE':'abc'},{'PAGE_SIZE':'0'},{'PAGE_SIZE':'101'},{'APP_MODE':'production'}):
        reject(lambda: cfg.baca_konfigurasi(data))
    importer = load('db-impor-csv')
    import sqlite3
    con = sqlite3.connect(':memory:')
    con.execute('CREATE TABLE barang(kode TEXT PRIMARY KEY NOT NULL, stok INTEGER CHECK(stok>=0))')
    content = '\n'.join(['kode,stok','A,2','B,0','A,3','C,-1'])
    assert importer.impor(con, content)[0] == 2
    assert importer.impor(con, content)[0] == 0
    reject(lambda: importer.impor(con, 'wrong,header\na,2'))
    assert con.execute('SELECT SUM(stok) FROM barang').fetchone()[0] == 2
    con.close()
    repo = load('oop-repository-service')
    store = repo.RepositoryMemori()
    service = repo.LayananTiket(store)
    row = store.ambil(1); row['status']='SELESAI'
    assert store.ambil(1)['status']=='BARU'
    reject(lambda: service.mulai(9), LookupError)
    assert service.mulai(1)['status']=='DIPROSES'
    reject(lambda: service.mulai(1))

    orm = load('db-sqlalchemy')
    engine = create_engine('sqlite+pysqlite:///:memory:')
    orm.Base.metadata.create_all(engine)
    from sqlalchemy.exc import IntegrityError
    try:
        with Session(engine) as session:
            try:
                with session.begin():
                    session.add(orm.Barang(nama='X',stok=-1))
                    session.flush()
            except IntegrityError:
                pass
            else:
                raise AssertionError('ORM constraint accepted negative stock')
        with Session(engine) as session:
            assert session.scalars(select(orm.Barang)).all()==[]
    finally:
        engine.dispose()

    validate = load('api-validasi-error')
    with TestClient(validate.app) as client:
        for payload in ({'judul':'','prioritas':1},{'judul':'X','prioritas':True},{'judul':'X','prioritas':'2'},
                        {'judul':'X'*121,'prioritas':1},{'judul':'X','prioritas':1,'extra':1}):
            assert client.post('/tiket',json=payload).status_code==422
    project = load('api-proyek-tiket')
    old_url = os.environ.pop('DATABASE_URL',None)
    try:
        reject(project.create_from_env,RuntimeError)
    finally:
        if old_url is not None: os.environ['DATABASE_URL']=old_url

    def api_contract(url, fail_audit=False):
        app=project.create_app(url)
        with TestClient(app) as client:
            assert client.get('/tiket/999999').status_code==404
            assert client.post('/tiket',json={'judul':' '}).status_code==422
            assert client.get('/tiket?limit=101').status_code==422
            assert client.get('/tiket?setelah=-1').status_code==422
            tech_response=client.post('/teknisi',json={'kode':'N01','nama':'Ana'})
            assert tech_response.status_code==201
            tech=tech_response.json()['id']
            assert client.post('/teknisi',json={'kode':'N01','nama':'Duplikat'}).status_code==409
            response=client.post('/tiket',json={'judul':' Link putus '})
            assert response.status_code==201 and response.json()['judul']=='Link putus'
            ticket=response.json()['id']
            path=f'/tiket/{ticket}'
            assert client.patch(path+'/status',json={'status':'SELESAI'}).status_code==409
            assert client.patch(path+'/status',json={'status':'DIPROSES','teknisi_id':True}).status_code==422
            assert client.patch(path+'/status',json={'status':'DIPROSES','teknisi_id':999999}).status_code==404
            assert len(client.get(path+'/riwayat').json())==1
            if fail_audit:
                with app.state.engine.begin() as db:
                    db.exec_driver_sql("CREATE TRIGGER reject_audit BEFORE INSERT ON riwayat_api WHEN NEW.status='DIPROSES' BEGIN SELECT RAISE(ABORT,'test'); END")
                # Internal failure is deliberately not converted into a false success.
                with TestClient(app, raise_server_exceptions=False) as failing:
                    assert failing.patch(path+'/status',json={'status':'DIPROSES','teknisi_id':tech}).status_code==500
                assert client.get(path).json()['status']=='BARU'
                assert len(client.get(path+'/riwayat').json())==1
                with app.state.engine.begin() as db:
                    db.exec_driver_sql('DROP TRIGGER reject_audit')
            assert client.patch(path+'/status',json={'status':'DIPROSES','teknisi_id':tech}).status_code==200
            assert client.patch(path+'/status',json={'status':'SELESAI'}).status_code==200
            assert client.patch(path+'/status',json={'status':'SELESAI'}).status_code==409
            assert [r['status'] for r in client.get(path+'/riwayat').json()]==['BARU','DIPROSES','SELESAI']
            assert client.get('/laporan').json()=={'BARU':0,'DIPROSES':0,'SELESAI':1}
            assert len(client.get('/tiket?limit=1').json())==1
            assert client.get('/tiket',params={'setelah':ticket}).json()==[]
            assert client.put(path,json={}).status_code==405
        return ticket

    url='sqlite+pysqlite:///'+str(folder/'api.db')
    ticket=api_contract(url,True)
    again=project.create_app(url)
    with TestClient(again) as client:
        assert client.get(f'/tiket/{ticket}').json()['status']=='SELESAI'
    dsn=postgres_dsn()
    time.sleep(0.2)
    # Each PostgreSQL SQL lab rolls its objects and roles back.
    for slug in ('db-postgresql-server','db-role-akses'):
        b=by_slug[slug]['blocks'][0]
        assert run_postgres(b['code']).strip()==b['output'].strip()
    time.sleep(0.2)
    with psycopg.connect(dsn,autocommit=True) as pg:
        pg.execute('BEGIN')
        pg.execute('CREATE ROLE course_read_test NOLOGIN')
        pg.execute('CREATE SCHEMA course_acl_test')
        pg.execute('CREATE TABLE course_acl_test.rows(id integer PRIMARY KEY)')
        pg.execute('GRANT USAGE ON SCHEMA course_acl_test TO course_read_test')
        pg.execute('GRANT SELECT ON course_acl_test.rows TO course_read_test')
        pg.execute('SET LOCAL ROLE course_read_test')
        pg.execute('SAVEPOINT deny_write')
        reject(lambda: pg.execute('INSERT INTO course_acl_test.rows VALUES (1)'),psycopg.errors.InsufficientPrivilege)
        pg.execute('ROLLBACK TO SAVEPOINT deny_write')
        pg.execute('ROLLBACK')
    time.sleep(0.2)
    # The caller must provide an empty dedicated native test DB if using an external DSN.
    pg_url=make_url(dsn).set(drivername='postgresql+psycopg').render_as_string(hide_password=False)
    api_contract(pg_url)
print('PASS: configuration boundaries, CSV duplicates, repository isolation, ORM rollback, API validation/404/409/422/pagination/history, failed-audit atomicity, SQLite persistence, PostgreSQL role denial and PostgreSQL-wire API integration')
print('PostgreSQL fixture: PGlite WASM when COURSE_PGLITE_BIN is used; native concurrency/authentication is outside that fixture.')

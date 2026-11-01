"""Exercise the published completion lessons, including rejected writes and audit rollback.
Use a dedicated empty test database; see README-programming-server.md.
"""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import sys
import tempfile
import time
from secrets import token_urlsafe
import httpx
from fastapi.testclient import TestClient
from sqlalchemy import select, text, create_engine, event
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session, selectinload
from programming_postgres_runner import postgres_dsn

ROOT = Path(__file__).resolve().parents[1]
lessons = {x['slug']:x for name in ['programming-api-lessons.json','programming-database-lessons.json']
           for x in json.loads((ROOT/'lib'/name).read_text())}
with tempfile.TemporaryDirectory() as folder:
    folder = Path(folder)
    def load(slug):
        code = next(b['code'] for b in lessons[slug]['blocks'] if b.get('language','python')=='python')
        path = folder/(slug.replace('-','_')+'.py');path.write_text(code)
        spec = importlib.util.spec_from_file_location(path.stem,path)
        module = importlib.util.module_from_spec(spec);sys.modules[path.stem]=module
        with contextlib.redirect_stdout(io.StringIO()):spec.loader.exec_module(module)
        return module

    crud=load('api-crud-lengkap')
    with TestClient(crud.create_app()) as c:
        assert c.post('/tiket',json={'judul':'   '}).status_code==422
        first=c.post('/tiket',json={'judul':'A'}).json()['id']
        assert c.patch(f'/tiket/{first}',json={'judul':'B'}).json()['judul']=='B'
        assert c.get('/tiket?limit=0').status_code==422
        assert c.delete(f'/tiket/{first}').content==b''
        assert c.get(f'/tiket/{first}').status_code==404
        assert c.post('/tiket',json={'judul':'C'}).json()['id']>first

    access=load('api-autentikasi-otorisasi');a=token_urlsafe(32);b=token_urlsafe(32);s=token_urlsafe(32)
    registry={access.sha256(t.encode()).hexdigest():u for t,u in [
        (a,{'id':10,'role':'operator'}),(b,{'id':20,'role':'operator'}),(s,{'id':99,'role':'supervisor'})]}
    h=lambda t:{'Authorization':f'Bearer {t}'}
    with TestClient(access.create_app(registry)) as c:
        for headers in ({},h('unknown'),{'Authorization':'Basic abc'}):
            r=c.get('/tiket/1',headers=headers);assert r.status_code==401
            assert r.headers['www-authenticate']=='Bearer'
        assert c.get('/tiket/1',headers=h(b)).status_code==404
        assert c.get('/supervisor',headers=h(a)).status_code==403
        assert c.get('/supervisor',headers=h(s)).status_code==200

    errors=load('api-error-observabilitas')
    @errors.app.get('/private')
    def private():raise errors.HTTPException(401,'secret',headers={'WWW-Authenticate':'Bearer'})
    with TestClient(errors.app) as c:
        r=c.get('/private');assert r.status_code==401
        assert r.headers['www-authenticate']=='Bearer'
        assert 'secret' not in r.text
        assert r.json()['error']['request_id']==r.headers['x-request-id']
        r=c.post('/contoh',json={'jumlah':'secret input'})
        assert r.status_code==422 and 'secret input' not in r.text

    client=load('api-client-timeout-retry')
    calls=[]
    def failing(req):
        calls.append(1);raise httpx.ConnectTimeout('test',request=req)
    with httpx.Client(transport=httpx.MockTransport(failing)) as c:
        try:client.baca_status(c,jeda=lambda _:None)
        except httpx.ConnectTimeout:pass
        else:raise AssertionError('Timeout swallowed')
    assert len(calls)==3
    calls=[]
    def not_found(req):calls.append(1);return httpx.Response(404)
    with httpx.Client(transport=httpx.MockTransport(not_found)) as c:
        try:client.baca_status(c,jeda=lambda _:None)
        except httpx.HTTPStatusError:pass
        else:raise AssertionError('404 swallowed')
    assert len(calls)==1
    cors=load('api-cors-operasional')
    with TestClient(cors.app) as c:
        assert 'access-control-allow-origin' not in c.get('/health',headers={'Origin':'https://untrusted.invalid'}).headers

    orm=load('db-orm-relasi');engine=create_engine('sqlite+pysqlite:///:memory:')
    orm.Base.metadata.create_all(engine)
    with Session(engine) as session,session.begin():
        session.add_all([orm.Teknisi(nama=f'T{i}',tiket=[orm.Tiket(judul='X')]) for i in range(8)])
    queries=[]
    @event.listens_for(engine,'before_cursor_execute')
    def count(conn,cursor,statement,parameters,context,executemany):queries.append(statement)
    with Session(engine) as session:
        rows=session.scalars(select(orm.Teknisi).options(selectinload(orm.Teknisi.tiket))).all()
        assert sum(len(x.tiket) for x in rows)==8
    assert len(queries)==2
    engine.dispose()

    project=load('api-proyek-tiket-aman')
    def exercise(url):
        app=project.create_app(url,registry)
        with TestClient(app,raise_server_exceptions=False) as c:
            assert c.get('/tiket').status_code==401
            assert c.post('/tiket',json={'judul':'X','owner_id':20},headers=h(a)).status_code==422
            assert c.post('/tiket',json={'judul':'   '},headers=h(a)).status_code==422
            item=c.post('/tiket',json={'judul':'A'},headers=h(a));assert item.status_code==201
            id=item.json()['id'];path=f'/tiket/{id}'
            assert item.json()['owner_id']==10
            for method,suffix,payload in [('get','',None),('get','/riwayat',None),('patch','',{'judul':'hack','versi':1}),('delete','?versi=1',None)]:
                kwargs={'headers':h(b)}
                if payload is not None:kwargs['json']=payload
                assert c.request(method,path+suffix,**kwargs).status_code==404
            assert c.get('/tiket',headers=h(b)).json()==[]
            assert len(c.get('/tiket',headers=h(s)).json())==1
            assert c.get('/tiket?limit=101',headers=h(a)).status_code==422
            assert c.patch(path,json={'status':'SELESAI','versi':1},headers=h(a)).status_code==409
            assert c.patch(path,json={'judul':'B','versi':1},headers=h(a)).json()['versi']==2
            assert c.patch(path,json={'judul':'stale','versi':1},headers=h(a)).status_code==409
            assert len(c.get(path+'/riwayat',headers=h(a)).json())==2
            r=c.delete(path+'?versi=2',headers=h(a));assert r.status_code==204 and r.content==b''
            assert c.get(path,headers=h(a)).status_code==404
            assert c.post(path+'/restore?versi=3',headers=h(a)).status_code==403
            assert c.post(path+'/restore?versi=2',headers=h(s)).status_code==409
            assert c.post(path+'/restore?versi=3',headers=h(s)).json()['versi']==4
            assert c.patch(path,json={'status':'DIPROSES','versi':4},headers=h(a)).json()['versi']==5
            assert c.delete(path+'?versi=5',headers=h(a)).status_code==409
            # Reject audit inserts, then prove the business change rolls back too.
            with app.state.engine.begin() as con:
                if con.dialect.name=='sqlite':
                    con.execute(text("CREATE TRIGGER reject_audit BEFORE INSERT ON audit_aman BEGIN SELECT RAISE(ABORT, 'test'); END"))
                else:
                    con.execute(text("CREATE FUNCTION reject_audit_fn() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'test'; END $$"))
                    con.execute(text("CREATE TRIGGER reject_audit BEFORE INSERT ON audit_aman FOR EACH ROW EXECUTE FUNCTION reject_audit_fn()"))
            before=c.get(path+'/riwayat',headers=h(a)).json()
            assert c.patch(path,json={'judul':'must rollback','versi':5},headers=h(a)).status_code==500
            row=c.get(path,headers=h(a)).json()
            assert (row['judul'],row['versi'])==('B',5)
            assert c.get(path+'/riwayat',headers=h(a)).json()==before
            with app.state.engine.begin() as con:
                if con.dialect.name=='sqlite':con.execute(text('DROP TRIGGER reject_audit'))
                else:
                    con.execute(text('DROP TRIGGER reject_audit ON audit_aman'))
                    con.execute(text('DROP FUNCTION reject_audit_fn()'))
            assert c.patch(path,json={'status':'SELESAI','versi':5},headers=h(a)).json()['versi']==6
        # Reopen the same database to verify durable data and history.
        with TestClient(project.create_app(url,registry)) as c:
            assert c.get(path,headers=h(a)).json()['status']=='SELESAI'
            assert [x['aksi'] for x in c.get(path+'/riwayat',headers=h(a)).json()]==['BUAT','UBAH','ARSIP','RESTORE','UBAH','UBAH']
    exercise('sqlite+pysqlite:///'+str(folder/'secure.db'))
    dsn=postgres_dsn();time.sleep(0.2)
    url=make_url(dsn).set(drivername='postgresql+psycopg').render_as_string(hide_password=False)
    exercise(url)
print('PASS: CRUD, object authorization, supervisor access, error contracts, bounded retries, CORS, eager loading; SQLite/PostgreSQL secure project persistence, version conflicts and audit rollback')

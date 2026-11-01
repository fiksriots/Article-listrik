"""Test the exact published API lessons, including failures and simultaneous retries.
Only temporary SQLite files are used. Infrastructure templates require target-host QA.
"""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from secrets import token_urlsafe,token_bytes
import sqlite3
import sys
import tempfile
from datetime import datetime,timezone
from fastapi.testclient import TestClient
from pwdlib import PasswordHash

ROOT=Path(__file__).resolve().parents[1]
lessons={x['slug']:x for x in json.loads((ROOT/'lib/programming-api-lessons.json').read_text())}
with tempfile.TemporaryDirectory() as tmp:
    folder=Path(tmp)
    def load(slug):
        b=next(b for b in lessons[slug]['blocks'] if b.get('language','python')=='python')
        path=folder/b['filename'];path.write_text(b['code'])
        name=path.stem+'_test';spec=importlib.util.spec_from_file_location(name,path)
        module=importlib.util.module_from_spec(spec);sys.modules[name]=module
        with contextlib.redirect_stdout(io.StringIO()):spec.loader.exec_module(module)
        return module
    response=load('api-response-kontrak')
    @response.app.get('/broken',response_model=response.TiketOut)
    def broken():return {'id':'not-a-number','judul':'X'}
    with TestClient(response.app,raise_server_exceptions=False) as c:
        assert c.get('/v1/tiket/1').json()=={'id':1,'judul':'Link A'}
        assert c.get('/broken').status_code==500
        schema=c.get('/openapi.json').json()
        assert 'TiketOut' in schema['components']['schemas']

    auth=load('api-jwt-sesi');secret=token_urlsafe(48);password=token_urlsafe(24)
    users={'ana':{'password_hash':PasswordHash.recommended().hash(password)}}
    headers=lambda t:{'Authorization':'Bearer '+t}
    app=auth.create_app(secret,users)
    with TestClient(app) as c:
        def login():
            r=c.post('/login',json={'username':'ana','password':password});assert r.status_code==200
            assert r.headers['cache-control']=='no-store'
            assert set(r.json())=={'access_token','token_type'}
            return r.json()['access_token']
        assert c.post('/login',json={'username':'ana','password':'wrong'}).status_code==401
        assert c.post('/login',json={'username':'unknown','password':'wrong'}).status_code==401
        first,second=login(),login()
        claims=auth.jwt.decode(second,secret,algorithms=['HS256'],issuer=auth.ISSUER,audience=auth.AUDIENCE)
        assert c.get('/me',headers=headers(second)).status_code==200
        now=int(datetime.now(timezone.utc).timestamp())
        for mutated in [dict(claims,exp=now-1),dict(claims,aud='wrong'),dict(claims,iss='wrong'),dict(claims,nbf=now+600),dict(claims,jti='unknown')]:
            token=auth.jwt.encode(mutated,secret,algorithm='HS256')
            assert c.get('/me',headers=headers(token)).status_code==401
        for name in auth.REQUIRED:
            changed=dict(claims);changed.pop(name)
            assert c.get('/me',headers=headers(auth.jwt.encode(changed,secret,algorithm='HS256'))).status_code==401
        assert c.get('/me',headers=headers(auth.jwt.encode(claims,secret,algorithm='HS512'))).status_code==401
        assert c.get('/me',headers=headers(auth.jwt.encode(claims,token_urlsafe(48),algorithm='HS256'))).status_code==401
        assert c.post('/logout',headers=headers(first)).status_code==204
        assert c.get('/me',headers=headers(first)).status_code==401
        assert c.get('/me',headers=headers(second)).status_code==200
        tokens=[login() for _ in range(6)]
        assert c.get('/me',headers=headers(tokens[0])).status_code==401
        assert c.get('/me',headers=headers(tokens[-1])).status_code==200
    with TestClient(auth.create_app(secret,users)) as c:
        assert c.get('/me',headers=headers(tokens[-1])).status_code==401
    with TestClient(auth.create_app(secret,{'ana':dict(users['ana'],disabled=True)})) as c:
        assert c.post('/login',json={'username':'ana','password':password}).status_code==401

    idem=load('api-idempotensi');a,b=token_urlsafe(32),token_urlsafe(32)
    registry={idem.sha256(a.encode()).hexdigest():'ana',idem.sha256(b.encode()).hexdigest():'budi'}
    path=str(folder/'idempotent.db');app=idem.create_app(path,registry)
    ha=dict(headers(a),**{'Idempotency-Key':'key-1'});hb=dict(headers(b),**{'Idempotency-Key':'key-1'})
    def counts(path,tables):
        with contextlib.closing(sqlite3.connect(path)) as con:
            return tuple(con.execute('SELECT count(*) FROM '+table).fetchone()[0] for table in tables)
    def sql(path,statement):
        with contextlib.closing(sqlite3.connect(path)) as con,con:
            con.execute(statement)
    with TestClient(app,raise_server_exceptions=False) as c:
        assert c.post('/tiket',json={'judul':'X'}).status_code==401
        assert c.post('/tiket',json={'judul':'X'},headers=headers(a)).status_code==422
        assert c.post('/tiket',json={'judul':'   '},headers=ha).status_code==422
        first=c.post('/tiket',json={'judul':' X '},headers=ha);again=c.post('/tiket',json={'judul':'X'},headers=ha)
        assert first.json()==again.json() and again.headers['X-Replayed']=='true'
        assert c.post('/tiket',json={'judul':'Y'},headers=ha).status_code==409
        assert c.post('/tiket',json={'judul':'X'},headers=hb).json()['id']!=first.json()['id']
        assert counts(path,['tiket','receipt'])==(2,2)
        sql(path,"CREATE TRIGGER reject_receipt BEFORE INSERT ON receipt BEGIN SELECT RAISE(ABORT,'test'); END")
        fresh=dict(headers(a),**{'Idempotency-Key':'failed-1'})
        assert c.post('/tiket',json={'judul':'Z'},headers=fresh).status_code==500
        assert counts(path,['tiket','receipt'])==(2,2)
        sql(path,'DROP TRIGGER reject_receipt')
        assert c.post('/tiket',json={'judul':'Z'},headers=fresh).status_code==201
        with contextlib.closing(sqlite3.connect(path)) as lock:
            lock.execute('BEGIN IMMEDIATE')
            r=c.post('/tiket',json={'judul':'Busy'},headers=dict(headers(a),**{'Idempotency-Key':'busy'}))
            assert r.status_code==503 and r.headers['retry-after']=='1';lock.rollback()
    with TestClient(idem.create_app(path,registry)) as c:
        assert c.post('/tiket',json={'judul':'X'},headers=ha).json()==first.json()
    def concurrent_idem(_):
        with TestClient(app) as c:
            return c.post('/tiket',json={'judul':'Parallel'},headers=dict(headers(a),**{'Idempotency-Key':'parallel'}))
    with ThreadPoolExecutor(max_workers=2) as pool:
        results=list(pool.map(concurrent_idem,range(2)))
    assert all(r.status_code==201 for r in results) and results[0].json()==results[1].json()
    assert counts(path,['tiket','receipt'])==(4,4)

    rate=load('api-rate-limit');now=[0.0];token2=token_urlsafe(32)
    rate_registry=dict(registry);rate_registry[rate.sha256(token2.encode()).hexdigest()]='ana'
    with TestClient(rate.create_app(rate_registry,clock=lambda:now[0])) as c:
        assert c.post('/catatan',json={'isi':'A'},headers=headers(a)).status_code==200
        assert c.post('/catatan',json={'isi':'A'},headers=headers(token2)).status_code==200
        assert c.post('/catatan',json={'isi':'A'},headers=headers(a)).status_code==200
        r=c.post('/catatan',json={'isi':'A'},headers=headers(a));assert r.status_code==429 and int(r.headers['retry-after'])>0
        assert c.post('/catatan',json={'isi':'A'},headers=headers(b)).status_code==200
        now[0]=10.0
        assert c.post('/catatan',json={'isi':'A'},headers=headers(a)).status_code==200
        assert c.post('/catatan',json={'isi':'X'*121},headers=headers(a)).status_code==422

    webhook=load('api-webhook-signature');secret=token_bytes(32);now=[1700000000]
    raw=b'{"event_id":"e1","pesan":"A"}'
    def signed(module,raw,secret,stamp=None,**extra):
        timestamp=str(now[0] if stamp is None else stamp)
        return {'Content-Type':'application/json','X-Timestamp':timestamp,'X-Signature':module.sign(secret,timestamp,raw),**extra}
    with TestClient(webhook.create_app(secret,clock=lambda:now[0])) as c:
        assert c.post('/webhook',content=raw,headers=signed(webhook,raw,secret)).status_code==200
        for stamp in [now[0]-301,now[0]+301]:
            assert c.post('/webhook',content=raw,headers=signed(webhook,raw,secret,stamp)).status_code==401
        assert c.post('/webhook',content=raw+b' ',headers=signed(webhook,raw,secret)).status_code==401
        assert c.post('/webhook',content=raw,headers=signed(webhook,raw,token_bytes(32))).status_code==401
        bad=b'not json';assert c.post('/webhook',content=bad,headers=signed(webhook,bad,secret)).status_code==422
        h=signed(webhook,raw,secret);h['Content-Type']='text/plain'
        assert c.post('/webhook',content=raw,headers=h).status_code==415
        r=c.post('/webhook',content=iter([b'x'*4096,b'x'*4097]),headers={'Content-Type':'application/json'})
        assert r.status_code==413

    bts=load('api-kasus-alarm-bts');secret=token_bytes(32);secret2=token_bytes(32)
    sources={'monitor-1':{'secret':secret,'perangkat':{'BTS-A'}},'monitor-2':{'secret':secret2,'perangkat':{'BTS-B'}}}
    path=str(folder/'bts.db');app=bts.create_app(path,sources,clock=lambda:now[0])
    def payload(id='e1',device='BTS-A',**kw):
        return json.dumps(dict(event_id=id,perangkat=device,jenis='RADIO_DOWN',waktu='2026-01-01T00:00:00+00:00',**kw),separators=(',',':')).encode()
    raw=payload()
    h=signed(bts,raw,secret,**{'X-Sender':'monitor-1'})
    with TestClient(app,raise_server_exceptions=False) as c:
        first=c.post('/webhooks/alarm',content=raw,headers=h);assert first.status_code==201
        assert c.post('/webhooks/alarm',content=raw,headers=h).headers['X-Replayed']=='true'
        assert counts(path,['tiket','receipt','audit'])==(1,1,1)
        now[0]+=301
        assert c.post('/webhooks/alarm',content=raw,headers=h).status_code==401
        assert c.post('/webhooks/alarm',content=raw,headers=signed(bts,raw,secret,**{'X-Sender':'monitor-1'})).json()==first.json()
        altered=raw+b' '
        assert c.post('/webhooks/alarm',content=altered,headers=signed(bts,altered,secret,**{'X-Sender':'monitor-1'})).status_code==409
        forbidden=payload('forbidden','BTS-B')
        assert c.post('/webhooks/alarm',content=forbidden,headers=signed(bts,forbidden,secret,**{'X-Sender':'monitor-1'})).status_code==403
        bad=json.loads(raw);bad['waktu']='2026-01-01T00:00:00';bad=json.dumps(bad).encode()
        assert c.post('/webhooks/alarm',content=bad,headers=signed(bts,bad,secret,**{'X-Sender':'monitor-1'})).status_code==422
        for data in [dict(json.loads(raw),jenis='UNKNOWN'),dict(json.loads(raw),owner_id=99)]:
            bad=json.dumps(data).encode()
            assert c.post('/webhooks/alarm',content=bad,headers=signed(bts,bad,secret,**{'X-Sender':'monitor-1'})).status_code==422
        assert c.post('/webhooks/alarm',content=raw).status_code==401
        assert c.post('/webhooks/alarm',content=raw,headers=signed(bts,raw,token_bytes(32),**{'X-Sender':'monitor-1'})).status_code==401
        bad_type=signed(bts,raw,secret,**{'X-Sender':'monitor-1'});bad_type['Content-Type']='text/plain'
        assert c.post('/webhooks/alarm',content=raw,headers=bad_type).status_code==415
        assert c.post('/webhooks/alarm',content=iter([b'x'*8192,b'x']),headers={'X-Sender':'monitor-1'}).status_code==413
        foreign=payload('e1','BTS-B')
        assert c.post('/webhooks/alarm',content=foreign,headers=signed(bts,foreign,secret2,**{'X-Sender':'monitor-2'})).status_code==201
        assert counts(path,['tiket','receipt','audit'])==(2,2,2)
        sql(path,"CREATE TRIGGER reject_audit BEFORE INSERT ON audit BEGIN SELECT RAISE(ABORT,'test'); END")
        fresh=payload('failed')
        assert c.post('/webhooks/alarm',content=fresh,headers=signed(bts,fresh,secret,**{'X-Sender':'monitor-1'})).status_code==500
        assert counts(path,['tiket','receipt','audit'])==(2,2,2)
        sql(path,'DROP TRIGGER reject_audit')
        assert c.post('/webhooks/alarm',content=fresh,headers=signed(bts,fresh,secret,**{'X-Sender':'monitor-1'})).status_code==201
    with TestClient(bts.create_app(path,sources,clock=lambda:now[0])) as c:
        r=c.post('/webhooks/alarm',content=raw,headers=signed(bts,raw,secret,**{'X-Sender':'monitor-1'}));assert r.json()==first.json() and r.headers['X-Replayed']=='true'
    def concurrent_bts(_):
        raw=payload('parallel')
        with TestClient(app) as c:
            return c.post('/webhooks/alarm',content=raw,headers=signed(bts,raw,secret,**{'X-Sender':'monitor-1'}))
    with ThreadPoolExecutor(max_workers=2) as pool:
        results=list(pool.map(concurrent_bts,range(2)))
    assert all(r.status_code==201 for r in results) and results[0].json()==results[1].json()
    assert counts(path,['tiket','receipt','audit'])==(4,4,4)
    deploy=load('api-deployment')
    with TestClient(deploy.app) as c:assert c.get('/health/live').json()=={'status':'ok'}
print('PASS: response/OpenAPI contracts; JWT claims/signature/expiry/revocation/session bounds; idempotency scope/persistence/concurrent retry/rollback/busy; rate windows; webhook signature/freshness/body bounds; BTS device authorization, replay, concurrent dedup and audit rollback; liveness')
print('Limit: systemd/Nginx/TLS templates require target-host verification; SQLite concurrency here does not establish distributed or PostgreSQL behavior.')

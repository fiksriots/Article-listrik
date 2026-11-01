"""Validate PostgreSQL JSONB, search and RLS contracts on an isolated lab DB.
PGlite does not establish native-server authentication, concurrency or performance.
"""
import contextlib
import io
import json
import os
from pathlib import Path
import runpy
import tempfile
import time
from unittest.mock import patch
import psycopg
from psycopg.types.json import Jsonb
from programming_postgres_runner import postgres_dsn
from programming_sql_runner import statements

ROOT=Path(__file__).resolve().parents[1]
lessons={x['slug']:x for x in json.loads((ROOT/'lib/programming-database-lessons.json').read_text())}
dsn=postgres_dsn();time.sleep(0.2)
with psycopg.connect(dsn,autocommit=True) as con:
    def setup(slug):
        code=next(b['code'] for b in lessons[slug]['blocks'] if b.get('language')=='postgresql')
        for stmt in statements(code):
            if stmt.strip().upper()=='ROLLBACK;':continue
            con.execute(stmt)
    def rejected(sql,params,exception):
        con.execute('SAVEPOINT reject_test')
        try:
            con.execute(sql,params)
        except exception:
            con.execute('ROLLBACK TO SAVEPOINT reject_test')
        else:
            raise AssertionError('Expected rejection: '+sql)
        con.execute('RELEASE SAVEPOINT reject_test')

    setup('db-postgresql-jsonb')
    try:
        for payload in [{},[],None,{'tegangan':None},{'tegangan':'12.4'},{'tegangan':True}]:
            rejected("INSERT INTO lp_jsonb.telemetri VALUES (9,'X',now(),%s)",(Jsonb(payload),),psycopg.errors.CheckViolation)
        rejected("INSERT INTO lp_jsonb.telemetri VALUES (9,'X',now(),NULL)",None,psycopg.errors.NotNullViolation)
        assert con.execute('SELECT count(*) FROM lp_jsonb.telemetri').fetchone()[0]==3
        assert con.execute("SELECT id FROM lp_jsonb.telemetri WHERE payload @> %s ORDER BY id",(Jsonb({'mode':'baterai'}),)).fetchall()==[(1,),(3,)]
        assert con.execute("SELECT (payload ? 'suhu'), jsonb_typeof(payload->'suhu') FROM lp_jsonb.telemetri WHERE id=2").fetchone()==(False,None)
        assert con.execute("SELECT (payload ? 'suhu'), jsonb_typeof(payload->'suhu') FROM lp_jsonb.telemetri WHERE id=3").fetchone()==(True,'null')
    finally:con.execute('ROLLBACK')

    setup('db-postgresql-pencarian')
    try:
        query="SELECT id FROM lp_pencarian.tiket WHERE dokumen @@ plainto_tsquery('simple',%s) ORDER BY id"
        assert con.execute(query,('RADIO',)).fetchall()==[(1,)]
        assert con.execute(query,('radi',)).fetchall()==[]
        assert con.execute(query,('',)).fetchall()==[]
        assert con.execute(query,('gangguan radio',)).fetchall()==[(1,)]
        con.execute("UPDATE lp_pencarian.tiket SET catatan='Radio diperiksa' WHERE id=3")
        assert con.execute(query,('gangguan radio',)).fetchall()==[(1,),(3,)]
        con.execute(query,("x'); DROP TABLE lp_pencarian.tiket; --",)).fetchall()
        assert con.execute('SELECT count(*) FROM lp_pencarian.tiket').fetchone()[0]==3
    finally:con.execute('ROLLBACK')

    setup('db-postgresql-rls')
    try:
        assert con.execute('SELECT count(*) FROM lp_rls.tiket').fetchone()[0]==3
        con.execute('SET LOCAL ROLE lp_rls_ana')
        assert con.execute('SELECT id FROM lp_rls.tiket ORDER BY id').fetchall()==[(1,),(3,)]
        assert con.execute("UPDATE lp_rls.tiket SET judul='hack' WHERE id=2").rowcount==0
        assert con.execute('DELETE FROM lp_rls.tiket WHERE id=2').rowcount==0
        rejected("INSERT INTO lp_rls.tiket VALUES (4,'lp_rls_budi','hack')",None,psycopg.errors.InsufficientPrivilege)
        rejected("UPDATE lp_rls.tiket SET pemilik='lp_rls_budi' WHERE id=1",None,psycopg.errors.InsufficientPrivilege)
        assert con.execute("SELECT judul FROM lp_rls.tiket WHERE id=1").fetchone()==('Link A',)
        con.execute('SET LOCAL ROLE lp_rls_budi')
        assert con.execute('SELECT id FROM lp_rls.tiket ORDER BY id').fetchall()==[(2,)]
        assert con.execute('DELETE FROM lp_rls.tiket WHERE id=1').rowcount==0
        con.execute('RESET ROLE');con.execute('DROP POLICY milik_sendiri ON lp_rls.tiket')
        con.execute('SET LOCAL ROLE lp_rls_ana')
        assert con.execute('SELECT id FROM lp_rls.tiket').fetchall()==[]
    finally:
        con.execute('RESET ROLE');con.execute('ROLLBACK')
    # The lab transaction must leave neither permanent schemas nor test roles.
    assert con.execute("SELECT count(*) FROM pg_roles WHERE rolname IN ('lp_rls_ana','lp_rls_budi','lp_rls_pemakai')").fetchone()[0]==0
    assert con.execute("SELECT count(*) FROM pg_namespace WHERE nspname IN ('lp_rls','lp_jsonb','lp_pencarian')").fetchone()[0]==0

# The plan contract is independent of chosen scan shape, cost and wall-clock timing.
code=next(b['code'] for b in lessons['db-postgresql-explain']['blocks'] if b.get('requiresPostgres'))
with tempfile.TemporaryDirectory() as tmp:
    path=Path(tmp)/'baca_plan.py';path.write_text(code)
    time.sleep(0.2)
    with contextlib.redirect_stdout(io.StringIO()) as out,patch.dict(os.environ,{'DATABASE_URL':dsn}):
        scope=runpy.run_path(str(path),run_name='__main__')
    report=scope['report'];plan=report['Plan']
    assert plan['Actual Rows']==5 and plan['Actual Loops']==1
    assert 'Plan Rows' in plan and 'Total Cost' in plan and 'Execution Time' in report
    assert any('Blocks' in k for k in plan), 'BUFFERS metrics missing'
    assert '[10, 20, 30, 40, 50]' in out.getvalue()
print('PASS: JSONB shape/null constraints, parameterized containment, full-text semantics/generated updates, RLS SELECT/INSERT/UPDATE/DELETE denial and default deny, rollback cleanup, EXPLAIN JSON actual-row/buffer contract')

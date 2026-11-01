"""Test PostgreSQL snippets against explicit DSN or a local PGlite socket fixture.
PGlite is a WASM PostgreSQL engine; it is not a substitute for native server
concurrency/authentication/deployment checks. No database is provisioned remotely.
"""
import atexit
import os
from pathlib import Path
import socket
import subprocess
import time
import psycopg
from programming_sql_runner import statements

_process = None
_dsn = None

def postgres_dsn():
    global _process, _dsn
    if _dsn:
        return _dsn
    if os.environ.get('COURSE_PG_TEST_DSN'):
        _dsn = os.environ['COURSE_PG_TEST_DSN']
        return _dsn
    executable = os.environ.get('COURSE_PGLITE_BIN')
    if not executable:
        raise RuntimeError('Set COURSE_PG_TEST_DSN for an isolated test database, or COURSE_PGLITE_BIN for the PGlite test fixture')
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        port = sock.getsockname()[1]
    _process = subprocess.Popen([executable, '--host=127.0.0.1', f'--port={port}'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    def close():
        if _process and _process.poll() is None:
            _process.terminate()
            try:
                _process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                _process.kill()
    atexit.register(close)
    _dsn = f'postgresql://postgres@127.0.0.1:{port}/postgres'
    deadline = time.monotonic() + 25
    while time.monotonic() < deadline:
        try:
            with psycopg.connect(_dsn, connect_timeout=1):
                time.sleep(0.2)
                return _dsn
        except psycopg.OperationalError:
            if _process.poll() is not None:
                raise RuntimeError('PGlite fixture exited during startup')
            time.sleep(0.1)
    raise RuntimeError('PGlite fixture did not become ready')

def run_postgres(code):
    lines = []
    dsn = postgres_dsn()
    time.sleep(0.2)  # Socket fixture detaches the preceding connection asynchronously.
    with psycopg.connect(dsn, autocommit=True) as con:
        for statement in statements(code):
            cur = con.execute(statement)
            if cur.description:
                lines += [' | '.join('NULL' if x is None else str(x) for x in row) for row in cur.fetchall()]
    return '\n'.join(lines)

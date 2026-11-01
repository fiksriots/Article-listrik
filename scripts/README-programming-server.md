# Server-course validation

The articles are static educational content. They do not start API services on the learning site.

Use Python 3.11+ and an isolated virtual environment:

```sh
python -m pip install -r scripts/requirements-programming-server.txt
```

Run `check-programming-extended.py` and `check-programming-server.py` with **one** of:

- `COURSE_PG_TEST_DSN`: an empty, dedicated native PostgreSQL test database. The role must be able to create schemas and lab roles. Never supply an operational database URL. PostgreSQL SQL snippets roll their objects back, but the API contract test creates its own teaching tables and data.
- `COURSE_PGLITE_BIN`: the path to `pglite-server` from `@electric-sql/pglite-socket`. The helper starts a fresh local in-memory fixture, closes it on exit, and tests PostgreSQL SQL plus psycopg/SQLAlchemy wire-client integration.

For a local PGlite fixture, install its dependencies outside the app checkout:

```sh
npm install --prefix /tmp/course-pg @electric-sql/pglite @electric-sql/pglite-socket
COURSE_PGLITE_BIN=/tmp/course-pg/node_modules/.bin/pglite-server python scripts/check-programming-extended.py
COURSE_PGLITE_BIN=/tmp/course-pg/node_modules/.bin/pglite-server python scripts/check-programming-server.py
```

PGlite is a WASM PostgreSQL engine. These tests do **not** establish native PostgreSQL concurrency, password authentication, TLS, role provisioning for deployment, or multiworker production behavior. The API tests are sequential and use the FastAPI test client. SQLite tests separately cover file persistence and rollback of a status update when the audit insert fails.

The examples pin SQLAlchemy 2.0 and the listed FastAPI/Pydantic client stack intentionally. Starlette 1.10 emits an HTTPX deprecation warning with this tested compatibility path; the HTTP requests and assertions still run. Changing the client stack requires rerunning the checks.

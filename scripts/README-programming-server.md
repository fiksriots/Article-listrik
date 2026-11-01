# Server-course validation

The articles are static educational content. They do not start API services on the learning site.

Use Python 3.11+ and an isolated virtual environment:

```sh
python -m pip install -r scripts/requirements-programming-server.txt
```

Run `check-programming-extended.py`, `check-programming-server.py`, and `check-programming-api-complete.py` with **one** of:

- `COURSE_PG_TEST_DSN`: an empty, dedicated native PostgreSQL test database. The role must be able to create schemas and lab roles. Never supply an operational database URL. PostgreSQL SQL snippets roll their objects back, but the API contract test creates its own teaching tables and data.
- `COURSE_PGLITE_BIN`: the path to `pglite-server` from `@electric-sql/pglite-socket`. The helper starts a fresh local in-memory fixture, closes it on exit, and tests PostgreSQL SQL plus psycopg/SQLAlchemy wire-client integration.

For a local PGlite fixture, install its dependencies outside the app checkout:

```sh
npm install --prefix /tmp/course-pg @electric-sql/pglite @electric-sql/pglite-socket
COURSE_PGLITE_BIN=/tmp/course-pg/node_modules/.bin/pglite-server python scripts/check-programming-extended.py
COURSE_PGLITE_BIN=/tmp/course-pg/node_modules/.bin/pglite-server python scripts/check-programming-server.py
COURSE_PGLITE_BIN=/tmp/course-pg/node_modules/.bin/pglite-server python scripts/check-programming-api-complete.py
```

PGlite is a WASM PostgreSQL engine. These tests do **not** establish native PostgreSQL concurrency, password authentication, TLS, role provisioning for deployment, or multiworker production behavior. The API tests are sequential and use the FastAPI test client. SQLite tests separately cover file persistence and rollback of a status update when the audit insert fails.

The examples pin SQLAlchemy 2.0 and the listed FastAPI/Pydantic client stack intentionally. Starlette 1.10 emits an HTTPX deprecation warning with this tested compatibility path; the HTTP requests and assertions still run. Changing the client stack requires rerunning the checks.

The completion checks exercise CRUD deletion and non-reused identifiers, bearer-token rejection, object ownership across all operations, supervisor restore, validation/error headers, bounded client retries, CORS rejection, and a two-query ORM collection load. The protected ticket project is tested on SQLite and PostgreSQL wire integration for persistence, stale-version conflicts, status rules, archive/restore, and rollback when audit insertion is rejected by a database trigger. The full example runner also executes two real Alembic revisions, checks retained data, and repeats upgrade head. These checks do not simulate simultaneous writers on a native PostgreSQL server.

## PostgreSQL depth lessons

Run `check-programming-postgres-depth.py` with the same dedicated `COURSE_PG_TEST_DSN` or disposable `COURSE_PGLITE_BIN` fixture. The role must be able to create and switch lab roles. It validates JSONB constraints and missing/null semantics, generated full-text updates and parameterized search, RLS denial across SELECT/INSERT/UPDATE/DELETE and default deny, transaction cleanup of lab schemas/roles, and the EXPLAIN JSON contract. It does not assert a fixed scan type, cost, or duration.

The full example runner marks the PostgreSQL Python plan block with `requiresPostgres` and injects only the isolated test DSN as `DATABASE_URL` for that block. Readers configure their own local lab connection through the environment. Production credentials are not needed for these checks. PGlite verifies SQL behavior here; it does not establish native PostgreSQL performance, concurrency, TLS, or password authentication.

## API depth lessons

Install the pinned JWT/password-hashing additions from `requirements-programming-server.txt`. Run `python scripts/check-programming-api-depth.py` for the exact published response-model, JWT/session, idempotency, rate-limit, webhook, deployment-liveness, and BTS alarm examples. It uses disposable local SQLite files and TestClient; no accounts or external notifications are created.

The checks cover public response filtering and server-side response validation, required JWT claims/algorithm/signature/expiry/audience/issuer, logout and bounded active sessions, scoped idempotency with restart persistence and concurrent retries, receipt/audit rollback, busy-database retry status, sliding-window boundaries, webhook freshness and signature integrity, stream size limits, and sender/device authorization. The full curriculum runner executes each Python demonstration and all 28 new quiz definitions are included in coverage checks.

The Linux systemd/Nginx/TLS material is a target-host template, not provisioned infrastructure. Only its Python liveness sample is executed here. Native service management, certificates, firewall rules, reverse-proxy behavior, production login protection, distributed counters/sessions, PostgreSQL concurrency for these SQLite-only examples, and external notification delivery need their own environment-specific checks.

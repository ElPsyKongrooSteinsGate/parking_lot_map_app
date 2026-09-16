# osm-map-app Operations Specification

## 1. Runtime Model

The first release is a stateless Express.js service behind HTTPS. Runtime instances share no local session state; refresh-session and revocation state live in PostgreSQL. A connection pool is configured with bounded size, acquisition timeout, idle timeout, and statement timeout.

The application serves only the API. Static frontend delivery, if colocated later, must not weaken API CORS, caching, or security headers.

## 2. Health and Readiness

- `GET /health/live` returns process liveness without checking external dependencies.
- `GET /health/ready` checks PostgreSQL connectivity and required extensions/migrations.
- Health responses contain status, service version, and request ID but no connection strings, hostnames, or secrets.
- Readiness fails when the database is unavailable or schema compatibility is not met; liveness remains available for orchestrator diagnosis.

## 3. Observability

Use structured JSON logs with timestamp, level, service, environment, request ID, route template, status code, duration, actor ID when safe, and database timing. Redact authorization headers, cookies, passwords, token-like fields, and personal data.

Expose metrics for request latency and errors by route, database pool saturation, query failures/timeouts, authentication failures, authorization denials, occupancy transition conflicts, and readiness state. Traces should propagate the request ID and record database spans without SQL parameters containing sensitive values.

Alert on elevated 5xx rates, readiness failures, authentication abuse, pool exhaustion, slow spatial queries, and repeated occupancy conflicts.

## 4. Error Handling

Expected domain errors are translated to the documented error envelope and status codes. Unexpected errors are logged with a stack trace server-side and returned as `500 INTERNAL_ERROR` with only the request ID. The process must not continue in a corrupted state after initialization failure or an unrecoverable configuration error.

Graceful shutdown stops accepting traffic, waits for in-flight requests up to a deadline, closes the database pool, and exits. Forced termination is observable.

## 5. Performance Targets

Initial targets, subject to measurement in the deployed environment:

- P95 read latency below 300 ms for ordinary facility and availability queries.
- P95 nearby spatial search below 500 ms at the configured radius and expected data volume.
- P95 manager mutation below 500 ms excluding external systems.
- No unbounded collection response or unbounded database query.
- Availability reads remain usable during concurrent occupancy writes.

Every target is validated with representative hierarchy size, spatial distribution, and concurrency. Query plans must demonstrate index use for nearby and filtered space queries.

## 6. Deployment Environments

Development uses synthetic seed data and local credentials only. Test uses isolated PostgreSQL/PostGIS instances and deterministic fixtures. Staging mirrors production extensions, migrations, security headers, token settings, and observability. Production uses managed secrets, restricted database roles, automated backups, TLS, and controlled migration jobs.

Environment configuration is documented without secret values. Configuration drift is detected during startup and deployment review.

## 7. Backup and Recovery

PostgreSQL backups must support the agreed recovery point and recovery time objectives. Test restoration regularly in a separate environment, including PostGIS geometry and audit data. Document point-in-time recovery, migration recovery, and the behavior of in-flight occupancy events after a restore.

## 8. Background Work and Integration Boundaries

The first release may process manager-entered occupancy synchronously. Sensor ingestion, report generation, notifications, payment webhooks, and embedding generation belong behind explicit background-job or event boundaries. Jobs require idempotency keys, retry limits, dead-letter handling, and audit correlation before introduction.

The service must not call external payment or mapping systems from a database transaction. External side effects use an outbox or equivalent durable handoff when added.

## 9. Testing and Release Gates

Required release checks include:

- Unit tests for policy evaluation, validation, status transitions, and GeoJSON serialization.
- Repository integration tests against PostgreSQL with PostGIS enabled.
- API contract tests for success, validation, authorization, conflict, and error responses.
- Spatial tests for radius, bounding box, SRID, and coordinate order.
- Concurrency tests for occupancy transitions and optimistic version conflicts.
- Security tests for token lifecycle, rate limits, scope isolation, and log redaction.
- Migration tests from an empty database and a representative prior version.
- Smoke tests for liveness, readiness, login, discovery, and manager dashboard reads.

A release is blocked when migrations fail, protected endpoints lack policy coverage, spatial indexes are missing for required queries, or secrets appear in logs/artifacts.

## 10. Deferred Operations

WebSockets/server-sent events for live occupancy, managed queue infrastructure, distributed tracing backend selection, and pgvector index operations are deferred. Their future design must preserve the current request ID, audit, authorization, and database ownership rules.

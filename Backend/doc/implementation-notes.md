# Implementation Notes

## Completed

The current backend implementation includes:

- Express 5 TypeScript service
- Environment loading from `.env` with Zod validation
- PostgreSQL connection pool with bounded connection and statement timeouts
- PostGIS, pgcrypto, and citext migration setup
- UUID-based identity, role, facility, parking, occupancy-history, and audit tables
- Development seed command with synthetic users and facilities
- Graceful shutdown handling
- Request IDs and `x-request-id` response headers
- Helmet security headers
- Explicit CORS configuration
- JSON body size limit
- JWT bearer-token parsing
- Argon2id local password verification
- Standard API error envelope
- Liveness and PostgreSQL readiness endpoints
- Auth login and current-user endpoints
- Authenticated parking facility and parking-space read endpoints
- Zod query validation and parameterized SQL values

## Important implementation decisions

### Dedicated database

The application uses a dedicated `parking_app` database. This avoids collisions with unrelated databases that may already contain tables named `users` or `roles` with different column types.

### PostGIS geometry

Geometry is stored with SRID 4326, serialized with `ST_AsGeoJSON`, and exposed using GeoJSON coordinate order `[longitude, latitude]`.

### Seed credentials

Seed credentials are intentionally synthetic and local-only. They exist to exercise the frontend and API during development and must not be reused in production.

## Remaining work from the specifications

The product specifications describe a larger first release than the current vertical slice. Remaining implementation includes:

- Refresh-token sessions, token rotation, logout, and password recovery
- Complete role, permission, facility-scope, and zone-scope policy evaluation
- Commercial facility, lot, zone, level, area, row, and space mutation endpoints
- Nearby radius search, bounding-box GIS queries, and availability summaries
- Transactional occupancy transitions with status history and audit records
- Check-in/check-out operations
- Occupancy and activity reports
- Idempotency keys and optimistic concurrency with `If-Match`
- Rate limiting, metrics, structured request logging, and tracing
- Repository extraction from route modules
- Unit, contract, PostgreSQL/PostGIS integration, security, and concurrency tests

These items are deliberately listed rather than presented as implemented. The detailed acceptance criteria remain in [../specs/](../specs/).

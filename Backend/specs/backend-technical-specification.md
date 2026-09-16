# osm-map-app Backend Technical Specification

## 1. Document Control

| Field | Value |
|---|---|
| Product | osm-map-app |
| Specification | Backend technical specification |
| Status | Draft for implementation |
| Version | 0.1 |
| Date | 2026-09-16 |
| Backend style | Express.js REST API |
| Database | PostgreSQL with PostGIS; pgvector reserved for a future module |
| Data access | Parameterized raw SQL; no ORM |

## 2. Purpose

This specification defines the backend contract and implementation boundaries for the existing parking map application. It supports drivers discovering parking and parking managers operating facilities, spaces, access zones, and occupancy.

The backend is authoritative for authentication, authorization, validation, occupancy state, and auditability. The frontend must not be treated as a security boundary.

## 3. Scope

### 3.1 First implementation scope

- Authentication, session lifecycle, and current-user profile.
- Role, permission, facility-scope, and zone-scope authorization.
- Commercial facilities, parking facilities/lots, PAZ zones, levels, areas, rows, and spaces.
- Parking discovery, availability, GeoJSON features, radius search, and map filters.
- Manager space and facility operations.
- Occupancy summaries, check-in/check-out events, and operational reports.
- Audit events and operational observability.

### 3.2 Explicitly deferred

Reservations, payment processing, receipts, complete parking-session billing, sensor integrations, notifications, and pgvector similarity search are extension points only. Their future data ownership must not force first-scope endpoints to pretend they exist.

## 4. Domain Model

The canonical hierarchy is:

```text
Commercial facility
  -> Parking facility / lot
    -> PAZ zone
      -> Level
        -> Area
          -> Row
            -> Parking space
```

A commercial facility can contain multiple parking facilities. A parking facility is the operational lot presented to drivers. A PAZ zone is primarily an administrative grouping for access, circulation, permissions, and reporting; it may have optional geometry. A space belongs to exactly one parking facility and may optionally belong to each lower-level grouping.

All identifiers are UUIDs. Timestamps are UTC ISO 8601 values in API responses and `timestamptz` values in PostgreSQL. Soft deletion is used for business records that must remain auditable.

## 5. Architecture

```text
Browser / map client
        |
 HTTPS reverse proxy
        |
 Express application
   | middleware: request id, security headers, CORS, rate limits,
   | auth parsing, validation, authorization, error handling
   |
 Route controllers -> application services -> SQL repositories
                                             |
                              PostgreSQL + PostGIS
```

The application is a modular monolith for the first release. Modules own routes, service rules, repository queries, and API schemas. Controllers translate HTTP concerns; services coordinate transactions and business rules; repositories contain parameterized SQL only. No route may construct SQL from untrusted strings.

Recommended module boundaries:

- `auth`: credentials, tokens, sessions, and identity.
- `access`: roles, permissions, assignments, permits, and policy decisions.
- `facilities`: commercial facilities, parking facilities, and operating metadata.
- `parking`: zones, levels, areas, rows, spaces, rates, and status.
- `gis`: spatial reads, GeoJSON serialization, and nearby search.
- `occupancy`: events, current state, summaries, and reports.
- `audit`: immutable security and business audit events.

## 6. Cross-Cutting Contracts

### 6.1 Error envelope

Every non-2xx response uses:

```json
{
  "error": {
    "code": "PARKING_SPACE_NOT_FOUND",
    "message": "The requested parking space does not exist.",
    "details": [],
    "requestId": "uuid"
  }
}
```

Messages are safe for clients and contain no SQL, stack traces, tokens, or sensitive data. Validation details identify fields with stable machine-readable codes.

### 6.2 Pagination and filtering

Collection endpoints use cursor pagination by default:

`?limit=50&cursor=<opaque>&sort=createdAt:desc`

`limit` defaults to 25 and is capped at 100. Cursors are opaque and encode a stable unique ordering. APIs use allow-listed filter and sort fields. A response contains `items` and `pageInfo { nextCursor, hasNextPage }`.

### 6.3 Concurrency and idempotency

Mutating endpoints that can be retried accept `Idempotency-Key`. The key is scoped to the authenticated user and route, stored with the resulting response, and expires after 24 hours. Updates support `If-Match` with a version or ETag. Conflicting versions return `409 RESOURCE_VERSION_CONFLICT`.

### 6.4 API versioning

All application routes are under `/api/v1`. Breaking contract changes require a new version. Health endpoints are outside the versioned API.

## 7. Configuration

Configuration is read from environment or a secret provider at startup and validated before the server accepts traffic. Required values include database connection settings, access-token signing configuration, refresh-token lifetime, allowed origins, environment name, and log level. Secrets are never committed, logged, or returned by diagnostics.

## 8. Detailed Specifications

- [API Specification](api-specification.md)
- [Database Specification](database-specification.md)
- [Schema Specification](schema-specification.md)
- [Security Specification](security-specification.md)
- [Operations Specification](operations-specification.md)

## 9. Traceability to Current Application

The current frontend has mock authentication in `osm-map-app/src/mockApi/auth.ts`, policy examples in `osm-map-app/src/mockApi/authorization.ts`, GIS types in `osm-map-app/src/types/gis.ts`, and parking types in `osm-map-app/src/types/data.ts`. The backend contract resolves the current coordinate mismatch by using GeoJSON `[longitude, latitude]` at the API boundary.

The reference JSON contains facility, zone, level, row, type, and permit fields that are richer than the current TypeScript interfaces. The backend schema follows the richer hierarchy. Existing dashboard totals and driver parking listings are prototype values; production values must be queried from PostgreSQL.

## 10. Acceptance Criteria

- All first-scope endpoints have an owner module, data source, authorization rule, validation rule, and documented error behavior.
- All database writes use parameterized raw SQL inside an explicit repository boundary.
- Spatial queries use PostGIS and spatial indexes.
- Backend authorization denies requests independently of frontend route visibility.
- Occupancy changes are transactional and auditable.
- The service can expose readiness, health, correlation IDs, structured logs, and safe errors.
- Deferred reservations, payments, and pgvector behavior are clearly separated from first-scope guarantees.

## 11. Open Decisions Before Coding

- Confirm the supported identity provider versus local email/password accounts.
- Confirm the production payment provider before designing payment integration.
- Confirm whether occupancy is manager-entered, sensor-fed, or both.
- Confirm retention periods for audit events and occupancy history.
- Confirm deployment target and managed PostgreSQL provider.

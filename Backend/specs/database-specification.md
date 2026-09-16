# osm-map-app Database Specification

## 1. Database Standards

- PostgreSQL with PostGIS enabled in every environment.
- `pgcrypto` may provide UUID generation; UUIDs remain application-visible identifiers.
- `citext` may be used for case-insensitive email uniqueness.
- All timestamps use `timestamptz` and UTC.
- Monetary values use integer minor units plus an ISO currency code, or a carefully constrained `numeric`; floating point is prohibited for money.
- Database roles use least privilege. The application role cannot create extensions or alter schemas.
- No ORM. All access uses a small PostgreSQL driver pool, parameterized SQL, explicit repositories, and reviewed query plans.

## 2. Core Tables

| Table | Responsibility | Key relationships |
|---|---|---|
| `users` | Account identity, status, password hash | roles, assignments, audit actor |
| `roles` | Named roles | permissions |
| `permissions` | Action/resource permissions | roles |
| `user_roles` | User role membership | users, roles |
| `facility_assignments` | User access to commercial/parking facility | users, facilities |
| `zone_assignments` | User access to PAZ zones | users, zones |
| `commercial_facilities` | Commercial site metadata | parking facilities |
| `parking_facilities` | Operational lots, capacity, rates, hours | commercial facility, zones |
| `parking_zones` | PAZ administrative grouping and optional geometry | parking facility |
| `parking_levels` | Vertical level metadata | parking facility |
| `parking_areas` | Area grouping | level |
| `parking_rows` | Row grouping | area |
| `parking_spaces` | Individual space configuration and current status | lot, optional zone/level/area/row |
| `parking_space_status_history` | Append-only status transitions | space, actor |
| `occupancy_events` | Observed occupancy events and source IDs | space |
| `occupancy_snapshots` | Query-friendly aggregates by time bucket | facility hierarchy |
| `gis_features` | Optional spatial features not owned by a core record | entity reference |
| `audit_logs` | Security and business audit trail | actor and target references |

Future tables include `vehicles`, `parking_sessions`, `reservations`, `payments`, `rate_schedules`, and `embeddings`. Their absence in the first release must not be worked around with JSON blobs in core tables.

## 3. Required Columns and Constraints

Every mutable business table has `id`, `created_at`, `updated_at`, and a `version` integer. Soft-deletable tables have `deleted_at`. Use foreign keys with explicit delete behavior; a facility hierarchy is not hard-deleted when it has historical activity.

`parking_spaces` includes a unique `(parking_facility_id, label)` constraint, a controlled `space_type`, controlled `status`, `requires_permit`, allowed vehicle types, and optional `geometry geometry(Point, 4326)`. Capacity is derived from active spaces and may be cached on the lot only when maintained transactionally.

`parking_zones.geometry` is nullable and uses `geometry(Polygon, 4326)` when present. Because a PAZ is administrative, missing geometry is valid. A geometry, when supplied, must be valid and have an allowed location relationship with its parking facility.

`gis_features` uses a controlled `entity_type`, a UUID `entity_id`, `geometry geometry(Geometry, 4326)`, and a uniqueness rule appropriate to the entity/type pair. Geometry type and ownership rules are enforced in application validation and database constraints where practical.

`occupancy_events` includes a source, observed timestamp, optional external event ID, previous status, and new status. A unique constraint on `(source, external_event_id)` prevents duplicate ingestion when the external ID exists.

## 4. Indexing

Required indexes include:

- Unique normalized email on `users`.
- Foreign-key indexes for every assignment and hierarchy relationship.
- `(parking_facility_id, status)` and `(zone_id, status)` on spaces.
- GiST indexes on every queried PostGIS geometry column.
- B-tree indexes on event `observed_at`, space ID, and source ID.
- Composite indexes matching report filters and time ranges after query-plan validation.

Nearby discovery uses `ST_DWithin` against geography or a correctly transformed geometry. The selected representation must be consistent and benchmarked; geography is preferred for meter-based radius semantics.

## 5. Transactions

The following operations are atomic:

1. Occupancy transition: lock the space row, verify expected/current version and allowed transition, update current status, insert status history, insert occupancy event, and write audit log.
2. Manager configuration update: verify scope, validate hierarchy and capacity rules, update the record with optimistic concurrency, and write audit log.
3. Logout/revocation: mark the refresh session revoked and write the security event.

Repositories must use parameterized values for all user input. Dynamic identifiers such as sort columns are selected from an allow-list, never interpolated directly from a request.

## 6. Migrations and Seeds

Schema changes are versioned, forward-only migrations run by a deployment job. Application startup must not race to mutate production schema. Each migration has an up path, a tested rollback or documented irreversible step, and a compatibility note for rolling deployments.

Development seeds must use synthetic credentials and clearly fictional sample data. Production secrets and demo tokens are prohibited in seed files. Seed data should include the richer hierarchy represented by the current reference JSON while using a single canonical coordinate convention.

## 7. Retention and Privacy

Audit events and occupancy history require product-approved retention periods before implementation. Password hashes, refresh-token hashes, and personal identifiers are protected using database permissions and application redaction. Refresh tokens are stored hashed, never plaintext. Deletion or anonymization workflows must preserve legally required audit evidence without retaining unnecessary personal data.

## 8. pgvector Extension Point

pgvector is optional infrastructure for a future semantic search module, not a substitute for PostGIS. Future embeddings should live in a separate table with source entity, model/version, vector dimension, and generated timestamp. The system must define model versioning, rebuild behavior, and access controls before creating an index or endpoint. No first-scope query may depend on pgvector being installed.

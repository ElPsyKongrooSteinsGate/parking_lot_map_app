# Database Guide

## Database target

The backend expects PostgreSQL with PostGIS. The recommended local connection is a dedicated database:

```env
DATABASE_URL=postgres://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/parking_app
```

The project intentionally does not use the existing `postgres` database when it contains unrelated tables. The migration creates tables such as `users` and `parking_facilities`; running it against a database with incompatible tables can fail.

## Extensions

The initial migration enables:

- `pgcrypto` for UUID generation
- `postgis` for spatial columns and GeoJSON conversion
- `citext` for case-insensitive email uniqueness

The database owner must be allowed to create these extensions. The runtime application role should be more restricted in production.

## Migration

Migration file: [../migrations/001_initial.sql](../migrations/001_initial.sql)

Run it with:

```bash
npm run migrate
```

The migration is currently a single initial migration and is intended for an empty application database. Future schema changes should use additional numbered SQL files rather than editing an already-applied migration.

## Main tables

- `users`, `roles`, `user_roles`: identity and role membership
- `commercial_facilities`: commercial property containers
- `parking_facilities`: operational parking lots
- `parking_zones`: access and administrative zones
- `parking_levels`, `parking_areas`, `parking_rows`: parking hierarchy
- `parking_spaces`: individual spaces and current status
- `parking_space_status_history`: append-only status transitions
- `occupancy_events`: observed occupancy events
- `audit_logs`: security and business audit trail

The hierarchy is:

```text
Commercial facility
  -> Parking facility
    -> Zone
    -> Level -> Area -> Row -> Parking space
```

## Spatial conventions

- Stored geometry uses SRID 4326.
- API GeoJSON coordinates use `[longitude, latitude]`.
- Parking facility and space geometry use PostGIS geometry columns.
- Spatial indexes use GiST.
- `ST_AsGeoJSON` converts database geometry at the API boundary.

## Seed data

Run:

```bash
npm run seed
```

The seed is for development only. It creates these accounts:

| Email | Role |
|---|---|
| `developer@parkflow.test` | developer |
| `admin@parkflow.test` | admin |
| `manager@parkflow.test` | parking_manager |
| `driver@parkflow.test` | driver |

All use the local-only password `password123`.

The seed also creates a demo commercial facility, four lots, and one zone per lot. It is safe to rerun for the current seed records because inserts use conflict handling where applicable.

## Resetting local data

Do not reset a shared or production database. For a disposable local database, drop and recreate `parking_app`, then run `npm run migrate` and `npm run seed` again.

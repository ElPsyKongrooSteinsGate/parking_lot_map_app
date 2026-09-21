# Architecture

## Runtime

```text
Browser / map client
        |
        v
Express application :4000
  request ID -> Helmet -> CORS -> JSON body limit
  -> bearer authentication parsing
  -> health, auth, and parking routes
        |
        v
PostgreSQL + PostGIS
```

The service is stateless. Authentication and parking data are stored in PostgreSQL; no user session state is kept in the Node process.

## Source layout

```text
Backend/
  doc/                 Practical implementation documentation
  migrations/          Versioned SQL migrations
  specs/               Product and technical specifications
  src/
    app.ts             Express application composition
    server.ts          Process startup and graceful shutdown
    config.ts          Environment loading and validation
    errors.ts          Public API error envelope
    middleware.ts      Request IDs, JWT parsing, auth middleware
    types.ts           Shared TypeScript types
    db/
      pool.ts          Bounded PostgreSQL connection pool
      migrate.ts       Migration runner
      seed.ts          Synthetic development seed
    routes/
      health.ts        Liveness and readiness endpoints
      auth.ts          Login and current-user endpoints
      parking.ts       Facility and space reads
  .env.example         Safe environment template
  package.json         Scripts and dependencies
```

## Request flow

1. `requestContext` assigns or accepts a validated `x-request-id`.
2. Helmet adds security response headers.
3. CORS applies the configured origin allow-list.
4. Express parses JSON bodies up to 100 KB.
5. `authenticate` optionally verifies a bearer JWT and attaches the user.
6. A route validates input with Zod.
7. Protected routes call `requireAuth` or `requireRole`.
8. The route executes parameterized SQL through the PostgreSQL pool.
9. Unknown routes and expected errors use the standard error envelope.

## Current module boundaries

- `auth`: local credentials, password verification, JWT access tokens, current user.
- `parking`: facility and parking-space discovery reads.
- `db`: connection pool, migration, and development seed.
- `health`: liveness and PostgreSQL readiness.

The specifications also define future `access`, `facilities`, `gis`, `occupancy`, and `audit` modules. Their full write workflows are planned but are not all implemented in this first slice.

## Database boundary

Repositories are intended to own SQL and all values are passed as PostgreSQL parameters. The current read routes use the pool directly while the implementation is being expanded; new domain modules should extract dedicated repository functions rather than building SQL in controllers.

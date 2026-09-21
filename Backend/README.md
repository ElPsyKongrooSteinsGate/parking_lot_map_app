# osm-map-app backend

Express REST API for the parking map application. The service uses PostgreSQL/PostGIS and parameterized SQL repositories; it does not use an ORM.

## Local setup

1. Copy `.env.example` to `.env` and set a 32+ character `JWT_ACCESS_SECRET`.
2. Start PostgreSQL with PostGIS enabled and create the database in `DATABASE_URL`.
3. Run `npm install`, `npm run migrate`, then `npm run seed` for synthetic local data.
4. Run `npm run dev`.

Health endpoints are `GET /health/live` and `GET /health/ready`. Versioned application routes are under `/api/v1`.

The migration includes synthetic demo accounts using `password123` for local development only. Never use those credentials outside development.

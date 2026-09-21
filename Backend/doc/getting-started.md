# Getting Started

## Requirements

- Node.js 22 or newer
- npm
- PostgreSQL 14 or newer
- PostGIS enabled in the target database

The backend is an Express.js REST API using TypeScript, PostgreSQL, PostGIS, parameterized SQL, Zod validation, JWT access tokens, and Argon2id password hashing. It does not use an ORM.

## 1. Install dependencies

From the `Backend` directory:

```bash
npm install
```

## 2. Configure the environment

Create the local environment file:

```bash
cp .env.example .env
```

Git Bash uses `cp`. PowerShell uses `Copy-Item .env.example .env`.

Set the database URL and a development JWT secret in `.env`:

```env
DATABASE_URL=postgres://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/parking_app
JWT_ACCESS_SECRET=use-a-local-secret-with-at-least-32-characters
```

`.env` is ignored by Git and must never be committed.

## 3. Create the database

Create a dedicated empty database. Do not run this migration against an unrelated database that already contains tables with the same names.

Using the PostgreSQL client:

```bash
PGPASSWORD=YOUR_POSTGRES_PASSWORD createdb.exe -h localhost -U postgres -p 5432 parking_app
```

If the database already exists, continue to the next step.

## 4. Apply the schema

```bash
npm run migrate
```

The migration enables `pgcrypto`, `postgis`, and `citext`, then creates the identity, facility, parking, occupancy, and audit tables.

## 5. Seed local data

```bash
npm run seed
```

The seed creates synthetic demo accounts and four parking facilities. The demo password is `password123`; use these accounts only in local development.

## 6. Start the API

Development mode:

```bash
npm run dev
```

The API listens on `http://localhost:4000` by default.

Production-style compiled mode:

```bash
npm run build
npm start
```

## 7. Verify the service

```bash
curl http://localhost:4000/health/live
curl http://localhost:4000/health/ready
```

`/health/live` checks only process liveness. `/health/ready` checks PostgreSQL connectivity.

## Useful commands

```bash
npm run build     # Compile TypeScript
npm run migrate   # Apply the initial SQL migration
npm run seed      # Insert synthetic local data
npm run dev       # Start the development watcher
npm test          # Run Node test discovery
```

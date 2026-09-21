# Troubleshooting

## `DATABASE_URL` or `JWT_ACCESS_SECRET` is undefined

The backend loads `.env` automatically. Confirm the file exists in `Backend/.env`, then run the command from the `Backend` directory:

```bash
cd Backend
npm run migrate
```

For Git Bash, copy the template with `cp`, not `copy`:

```bash
cp .env.example .env
```

PowerShell equivalent:

```powershell
Copy-Item .env.example .env
```

## `foreign key constraint ... uuid and integer`

The migration was run against a database that already has an incompatible table, commonly an existing `users` table with integer IDs. Use a dedicated empty database such as `parking_app`. Do not delete or alter unrelated application data.

## `type "citext" does not exist`

Use the current migration, which enables `citext` automatically. If the migration file was edited locally, confirm it includes:

```sql
create extension if not exists citext;
```

The PostgreSQL user must have permission to create extensions.

## PostgreSQL connection failure

Check:

1. PostgreSQL is running.
2. The port matches your server, commonly `5432`.
3. The database exists.
4. The username and password in `.env` are correct.
5. PostGIS is installed and available.

Example connection test:

```bash
PGPASSWORD=YOUR_PASSWORD psql.exe -h localhost -U postgres -d parking_app -p 5432 -w -c "select 1;"
```

## Readiness returns `SERVICE_UNAVAILABLE`

Run the migration first, confirm `.env` points to the same database, and restart the API. The readiness endpoint performs a PostgreSQL `select 1` through the backend connection pool.

If an old Node process is still listening on port 4000, stop it and restart the current server. On Windows:

```bash
netstat -ano | findstr :4000
MSYS_NO_PATHCONV=1 taskkill.exe /PID YOUR_PID /T /F
```

## Port 4000 is already in use

Change `PORT` in `.env`, or stop the existing process. The frontend must use the matching API URL when the port changes.

## Login returns `AUTHENTICATION_FAILED`

Run `npm run seed` and use one of the local accounts documented in [database.md](database.md). The local demo password is `password123`.

## Migration was applied but seed fails

Make sure the migration completed in the same database named by `DATABASE_URL`. The seed expects the `users`, `roles`, `commercial_facilities`, `parking_facilities`, and `parking_zones` tables.

# Security Guide

## Local secrets

`.env` contains database credentials and signing secrets. It is ignored by Git. Use `.env.example` as the shareable template and never paste production secrets into source files, documentation, logs, or seed scripts.

The current local `.env` is configured for development only. Replace the JWT secret and rotate the PostgreSQL password before using any shared environment.

## Authentication

Login verifies passwords with Argon2id and issues a short-lived signed JWT access token. Password hashes are stored in PostgreSQL and never returned by the API.

The access token contains only the user ID, email, display name, and role. Protected requests must send:

```http
Authorization: Bearer <access-token>
```

The backend rejects malformed or invalid tokens with `401 AUTHENTICATION_FAILED`.

## Authorization

Unauthenticated callers cannot access parking data. Current route protection requires an authenticated user. Role-aware middleware exists for manager/admin routes as the write API is added.

The full specification requires deny-by-default scope checks for commercial facilities, parking facilities, and zones. Those resource-scope policies must be implemented before manager mutation endpoints are considered production-ready.

## Input protection

- JSON bodies are limited to 100 KB.
- Login input is strict and rejects unknown fields.
- Query filters are allow-listed and type validated with Zod.
- SQL values use PostgreSQL parameters.
- Dynamic SQL identifiers must use server-side allow-lists.
- Responses omit password hashes and internal database details.

## HTTP protection

The app configures:

- Helmet security headers
- Explicit CORS origins from `CORS_ORIGINS`
- Request IDs via `x-request-id`
- Safe client-facing error envelopes
- Server-side logging for unexpected errors

## Production checklist

Before production:

- Use a managed secret provider or environment injection.
- Use a dedicated least-privilege application database role.
- Put the API behind HTTPS.
- Replace the demo seed credentials.
- Add refresh-token rotation and revocation.
- Add rate limits for login and discovery.
- Complete facility and zone scope authorization.
- Add audit writes to security-sensitive mutations.
- Run dependency and migration checks in CI.
- Confirm CORS origins are not wildcard values.

# osm-map-app Security Specification

## 1. Security Principles

- The API is the authority for identity, authorization, and resource scope.
- Deny by default; grant the minimum action and resource scope required.
- Validate and normalize at the boundary, then use typed service inputs.
- Do not expose whether protected resources exist to unauthorized callers.
- Never log passwords, access tokens, refresh tokens, reset tokens, or full payment data.

## 2. Identity and Tokens

Local accounts, if retained, use a modern adaptive password hash such as Argon2id with parameters selected for the deployment hardware. Passwords are never reversible or stored in application logs.

Access tokens are short-lived, signed, and contain only stable identity and authorization context needed for request processing. Authorization is rechecked against current account status and resource scope for sensitive actions. Refresh tokens are long-lived opaque values, stored only as hashes, rotated on use, bound to a session/device record, and revoked on logout, password reset, account suspension, or suspected reuse.

The API defines `POST /auth/login`, `/auth/refresh`, `/auth/logout`, and `/auth/me` as described in [api-specification.md](api-specification.md). Password recovery uses single-use, expiring tokens and generic responses that do not reveal account existence.

## 3. Roles and Policies

Initial roles are `developer`, `admin`, `parking_manager`, and `driver`. Permissions are action/resource pairs such as:

- `dashboard:read`
- `parking_facility:read`
- `parking_space:read`
- `parking_space:update`
- `occupancy:write`
- `report:read`

Roles grant baseline permissions. Facility assignments and zone assignments constrain resource access. Admin and developer bypasses, if retained, are explicit privileged policies and are audited; they are not implemented as scattered conditionals.

Scope semantics follow the hierarchy: a facility assignment grants access to that commercial facility and its descendant parking facilities, zones, levels, areas, rows, and spaces. A parking-facility assignment grants only that lot and descendants. A zone assignment grants that zone and descendants. A zone assignment does not grant sibling zones or parent-level administration. Cross-facility resources are denied unless an explicit privileged permission exists.

For every protected request, policy evaluation receives `{ actor, action, resourceType, resourceId, resourceContext }` and returns allow/deny plus a reason code for audit. Resource context is loaded through scoped queries so a caller cannot bypass a check by guessing an ID.

## 4. Express Middleware Order

The application registers middleware in this order:

1. Request ID and trusted proxy configuration.
2. Strict HTTP security headers.
3. Body size and content-type limits.
4. CORS with an explicit allow-list.
5. Access-log context with sensitive-field redaction.
6. Global rate limiting and stricter auth endpoint limits.
7. Authentication parsing and token verification.
8. Route-level request validation.
9. Route-level authorization and resource scope checks.
10. Controller/service execution.
11. Not-found handling.
12. Central error translation and safe response formatting.

CSRF protection is required when authentication uses cookies. If bearer tokens are used exclusively in a non-browser channel, the deployment threat model must document the alternative protections. CORS is not an authorization mechanism.

## 5. Input and Output Protection

Request schemas enforce types, lengths, enum values, coordinate ranges, radius limits, pagination caps, and allowed filters. SQL uses placeholders for values. Sort and field selectors use server-side allow-lists. GeoJSON is parsed and validated rather than manipulated through string concatenation.

Responses use explicit DTOs and omit password hashes, token hashes, internal policy details, database errors, and unnecessary personal information. Error messages use stable public codes and include the request ID.

## 6. Abuse Controls

Apply per-IP and per-account limits to login, refresh, password recovery, discovery, and mutation routes. Use exponential backoff or temporary lockout without creating an account-enumeration oracle. Set request timeouts, body limits, database pool limits, and query timeouts. Reject oversized or deeply nested JSON.

## 7. Audit Requirements

Audit security events including login success/failure, refresh reuse, logout, password changes, account status changes, authorization denials for sensitive actions, role/scope changes, facility configuration changes, and occupancy overrides.

Each event contains event type, actor ID when known, target type/ID, decision, timestamp, request ID, source IP or trusted proxy-derived metadata, user-agent summary, and structured reason. Audit records are append-only to the application role and are protected from ordinary user access.

## 8. Secrets and Dependencies

Secrets are injected through environment or a managed secret store. They are validated at startup and redacted from error output. TLS terminates at a trusted boundary and internal transport requirements are documented per deployment. Dependencies are pinned through the package lockfile, scanned regularly, and updated through review. Production debug modes are disabled.

## 9. Security Acceptance Tests

Before implementation is accepted, tests must demonstrate that:

- Unauthenticated requests cannot access protected routes.
- Suspended users cannot use existing tokens for protected actions.
- A manager cannot read or mutate a sibling facility or zone.
- A driver cannot perform manager actions or alter space configuration.
- Invalid GeoJSON, coordinates, filters, and SQL-like input are safely rejected.
- Refresh-token reuse revokes the relevant session family.
- Sensitive values are absent from logs and error responses.
- Occupancy updates cannot create duplicate or impossible transitions under concurrent requests.

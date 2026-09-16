# osm-map-app API Specification

## 1. API Conventions

Base URL: `/api/v1`

Content type: `application/json`. Spatial responses use GeoJSON-compatible objects. Coordinates are always `[longitude, latitude]`; latitude/longitude input from a UI must be converted before calling the API.

Successful collection response:

```json
{
  "items": [],
  "pageInfo": { "nextCursor": null, "hasNextPage": false }
}
```

The standard error contract is defined in [backend-technical-specification.md](backend-technical-specification.md).

## 2. Authentication Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/login` | Public | Authenticate an active account |
| POST | `/auth/refresh` | Refresh token | Rotate the refresh token and issue access token |
| POST | `/auth/logout` | Access token | Revoke the current refresh session |
| GET | `/auth/me` | Access token | Return the authenticated user and effective scopes |
| POST | `/auth/password-reset/request` | Public | Start a recovery flow without revealing account existence |
| POST | `/auth/password-reset/confirm` | Reset token | Set a new password |

`POST /auth/login` accepts `{ email, password }` and returns `{ user, accessToken, expiresIn, refreshToken }`. Refresh tokens should preferably be delivered as `HttpOnly`, `Secure`, `SameSite` cookies; if a client contract requires a body token, the threat model must be reviewed before implementation.

Login returns `401 AUTHENTICATION_FAILED` for invalid credentials, `403 ACCOUNT_SUSPENDED` for a suspended account, and `429 RATE_LIMITED` after the configured threshold. It must not disclose whether an email exists.

## 3. Facility and Parking Hierarchy

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/commercial-facilities` | Authenticated | List facilities within caller scope |
| POST | `/commercial-facilities` | Admin | Create a commercial facility |
| GET | `/commercial-facilities/:facilityId` | Scoped | Read facility details |
| PATCH | `/commercial-facilities/:facilityId` | Admin or scoped manager | Update facility metadata |
| GET | `/parking-facilities` | Authenticated | List lots with availability summaries |
| POST | `/parking-facilities` | Admin or scoped manager | Create a lot |
| GET | `/parking-facilities/:parkingFacilityId` | Scoped | Read lot details |
| PATCH | `/parking-facilities/:parkingFacilityId` | Scoped manager/admin | Update lot metadata |
| GET | `/parking-facilities/:parkingFacilityId/zones` | Scoped | List PAZ zones |
| POST | `/parking-facilities/:parkingFacilityId/zones` | Scoped manager/admin | Create a PAZ zone |
| PATCH | `/zones/:zoneId` | Scoped manager/admin | Update zone metadata or optional geometry |
| GET | `/parking-spaces` | Scoped or public discovery | Filter spaces and statuses |
| GET | `/parking-spaces/:spaceId` | Scoped or discovery | Read a space |
| PATCH | `/parking-spaces/:spaceId` | Scoped manager/admin | Update configurable space fields |

Supported space filters include `parkingFacilityId`, `zoneId`, `levelId`, `status`, `spaceType`, `vehicleType`, `requiresPermit`, and `accessible`. Manager writes validate hierarchy ownership, allowed enum values, positive capacity/rates, operating hours, and that capacity is not reduced below current occupancy.

## 4. GIS and Discovery

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/gis/features` | Authenticated | Return map features within filters or a bounding box |
| GET | `/gis/features/:entityType/:entityId` | Scoped/discovery | Return one entity's GeoJSON feature |
| GET | `/availability/nearby` | Public or authenticated | Find nearby parking facilities |
| GET | `/availability/:parkingFacilityId` | Public or authenticated | Return current availability summary |

`GET /availability/nearby` requires `longitude`, `latitude`, and `radiusMeters`; radius is capped by configuration. Optional filters include vehicle type, accessible spaces, space type, open-now, and maximum hourly rate. The response includes facility identity, coordinates, distance in meters, availability counts, rate summary, and operating status.

Bounding box values are validated for latitude range, longitude range, non-inverted bounds, and maximum area. The service serializes PostGIS geometry into GeoJSON at the repository/service boundary and never exposes database-specific binary geometry.

## 5. Occupancy and Manager Operations

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/occupancy/summary` | Scoped manager/admin | Current totals by facility, lot, zone, level, or row |
| GET | `/occupancy/history` | Scoped manager/admin | Historical occupancy snapshots/events |
| POST | `/occupancy/events` | Scoped manager/system | Record an occupancy transition |
| POST | `/check-ins` | Scoped manager | Record an operational check-in |
| POST | `/check-outs` | Scoped manager | Record an operational check-out |
| GET | `/activity` | Scoped manager/admin | List check-in/out and status activity |
| GET | `/reports/occupancy` | Scoped manager/admin | Occupancy report for a time range |
| GET | `/reports/revenue` | Scoped manager/admin | Revenue report; deferred until payment data exists |

An occupancy event includes `spaceId`, `newStatus`, `observedAt`, `source`, and an optional external event ID. Duplicate external IDs are idempotent. A transition is rejected with `409 INVALID_STATUS_TRANSITION` when incompatible with the current state.

Check-in/out endpoints validate the referenced facility, optional vehicle metadata, actor scope, and current status. Each successful state change writes a status-history record and audit event in one transaction.

## 6. Status Codes and Validation

- `400 INVALID_REQUEST`: malformed JSON, invalid query, or invalid field format.
- `401 AUTHENTICATION_REQUIRED` or `AUTHENTICATION_FAILED`.
- `403 FORBIDDEN` or `ACCOUNT_SUSPENDED`.
- `404 RESOURCE_NOT_FOUND`.
- `409 RESOURCE_CONFLICT`, `RESOURCE_VERSION_CONFLICT`, or `INVALID_STATUS_TRANSITION`.
- `422 BUSINESS_RULE_VIOLATION`: valid shape but unacceptable business data.
- `429 RATE_LIMITED`.
- `500 INTERNAL_ERROR`; response details are empty and the request ID is logged.
- `503 SERVICE_UNAVAILABLE` when readiness dependencies are unavailable.

Validation runs before authorization when it can safely do so, but authorization is always enforced before returning protected resource data. Unknown body fields are rejected or stripped according to the endpoint schema, consistently across modules.

## 7. Deferred API Boundaries

Future modules may add `/reservations`, `/parking-sessions`, `/vehicles`, `/payments`, and `/search`. They must reuse the identity, facility hierarchy, audit, idempotency, and error contracts defined here. pgvector search must be an explicit opt-in module and must not replace PostGIS for geographic filtering.

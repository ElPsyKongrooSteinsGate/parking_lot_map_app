# API Guide

Base URL: `http://localhost:4000/api/v1`

All successful collection responses use:

```json
{
  "items": [],
  "pageInfo": { "nextCursor": null, "hasNextPage": false }
}
```

All error responses use:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "A safe client-facing message.",
    "details": [],
    "requestId": "uuid"
  }
}
```

## Health

Health routes are outside `/api/v1`:

```bash
curl http://localhost:4000/health/live
curl http://localhost:4000/health/ready
```

## Login

`POST /api/v1/auth/login` is public.

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"driver@parkflow.test","password":"password123"}'
```

Example response shape:

```json
{
  "user": {
    "id": "uuid",
    "email": "driver@parkflow.test",
    "displayName": "ParkFlow Driver",
    "role": "driver",
    "status": "active"
  },
  "accessToken": "jwt",
  "expiresIn": 900
}
```

Invalid credentials return `401 AUTHENTICATION_FAILED`. Invalid request bodies return `400 INVALID_REQUEST`.

## Current user

`GET /api/v1/auth/me` requires a bearer token:

```bash
curl http://localhost:4000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Parking facilities

`GET /api/v1/parking-facilities` requires authentication:

```bash
curl http://localhost:4000/api/v1/parking-facilities \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Supported query parameter:

- `limit`: integer from 1 to 100; default 25

The response includes lot identity, capacity, total active space count, occupied count, and optional GeoJSON geometry.

## Parking spaces

`GET /api/v1/parking-spaces` requires authentication:

```bash
curl "http://localhost:4000/api/v1/parking-spaces?status=available&limit=25" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Supported filters:

- `limit`: 1 to 100
- `parkingFacilityId`: UUID
- `zoneId`: UUID
- `status`: `available`, `occupied`, `reserved`, `unavailable`, `maintenance`
- `spaceType`: `standard`, `accessible`, `electric`, `motorcycle`, `loading`, `staff`

All filter values are validated before SQL execution. SQL values are parameterized.

## Implemented versus planned

Implemented now:

- `GET /health/live`
- `GET /health/ready`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/parking-facilities`
- `GET /api/v1/parking-spaces`

Defined by the product specification but still planned for later slices:

- Refresh, logout, and password recovery
- Facility and parking metadata writes
- Zones, levels, areas, rows, and space management endpoints
- Nearby availability and GIS feature endpoints
- Occupancy transitions, check-in/out, reports, and audit query endpoints

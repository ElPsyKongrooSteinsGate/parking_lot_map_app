import { Router } from 'express'
import type { Pool } from 'pg'
import { z } from 'zod'
import { ApiError } from '../errors.js'
import { requireAuth } from '../middleware.js'

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().optional(),
  parkingFacilityId: z.string().uuid().optional(),
  zoneId: z.string().uuid().optional(),
  status: z.enum(['available', 'occupied', 'reserved', 'unavailable', 'maintenance']).optional(),
  spaceType: z.enum(['standard', 'accessible', 'electric', 'motorcycle', 'loading', 'staff']).optional(),
}).strict()

export function parkingRouter(pool: Pool) {
  const router = Router()
  router.get('/parking-facilities', requireAuth, async (request, response, next) => {
    try {
      const result = await pool.query(`
        select pf.id, pf.name, pf.description, pf.capacity, pf.default_currency as "defaultCurrency",
               pf.default_hourly_rate_minor as "defaultHourlyRateMinor", pf.status,
               count(ps.id)::int as "spaceCount",
               count(ps.id) filter (where ps.status = 'occupied')::int as "occupiedCount",
               st_asgeojson(pf.geometry)::json as geometry
        from parking_facilities pf
        left join parking_spaces ps on ps.parking_facility_id = pf.id and ps.deleted_at is null
        where pf.deleted_at is null
        group by pf.id
        order by pf.created_at desc, pf.id desc
        limit $1`,  [querySchema.parse(request.query).limit])
      response.json({ items: result.rows, pageInfo: { nextCursor: null, hasNextPage: false } })
    } catch (error) { next(toApiError(error)) }
  })
  router.get('/parking-spaces', requireAuth, async (request, response, next) => {
    try {
      const input = querySchema.parse(request.query)
      const result = await pool.query(`
        select ps.id, ps.parking_facility_id as "parkingFacilityId", ps.zone_id as "zoneId", ps.level_id as "levelId",
               ps.area_id as "areaId", ps.row_id as "rowId", ps.label, ps.space_type as "spaceType", ps.status,
               ps.requires_permit as "requiresPermit", ps.allowed_vehicle_types as "allowedVehicleTypes",
               ps.hourly_rate_minor as "hourlyRateMinor", ps.currency, st_asgeojson(ps.geometry)::json as geometry
        from parking_spaces ps
        where ps.deleted_at is null
          and ($1::uuid is null or ps.parking_facility_id = $1)
          and ($2::uuid is null or ps.zone_id = $2)
          and ($3::space_status is null or ps.status = $3)
          and ($4::space_type is null or ps.space_type = $4)
        order by ps.created_at desc, ps.id desc limit $5`,
        [input.parkingFacilityId ?? null, input.zoneId ?? null, input.status ?? null, input.spaceType ?? null, input.limit],
      )
      response.json({ items: result.rows, pageInfo: { nextCursor: null, hasNextPage: false } })
    } catch (error) { next(toApiError(error)) }
  })
  return router
}

function toApiError(error: unknown) {
  if (error instanceof z.ZodError) return new ApiError(400, 'INVALID_REQUEST', 'The request is invalid.', error.issues.map((issue) => ({ field: issue.path.join('.'), code: issue.code })))
  return error
}

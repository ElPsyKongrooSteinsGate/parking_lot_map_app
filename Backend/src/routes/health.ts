import { Router } from 'express'
import type { Pool } from 'pg'
import type { AppConfig } from '../config.js'

export function healthRouter(config: AppConfig, pool: Pool) {
  const router = Router()
  router.get('/live', (request, response) => response.json({ status: 'ok', serviceVersion: config.serviceVersion, requestId: request.id }))
  router.get('/ready', async (request, response) => {
    try {
      await pool.query('select 1')
      response.json({ status: 'ready', serviceVersion: config.serviceVersion, requestId: request.id })
    } catch (error) {
      const databaseError = error instanceof Error ? error.message : 'unknown database error'
      console.error(JSON.stringify({ level: 'error', check: 'database-readiness', requestId: request.id, error: databaseError }))
      response.status(503).json({ error: { code: 'SERVICE_UNAVAILABLE', message: 'The service is not ready.', details: [], requestId: request.id } })
    }
  })
  return router
}

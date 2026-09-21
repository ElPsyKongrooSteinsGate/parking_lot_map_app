import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import type { Pool } from 'pg'
import type { AppConfig } from './config.js'
import { ApiError, errorHandler } from './errors.js'
import { authenticate, requestContext } from './middleware.js'
import { healthRouter } from './routes/health.js'
import { authRouter } from './routes/auth.js'
import { parkingRouter } from './routes/parking.js'

export function createApp(config: AppConfig, pool: Pool) {
  const app = express()
  app.disable('x-powered-by')
  app.set('trust proxy', 1)
  app.use(requestContext)
  app.use(helmet())
  app.use(cors({ origin: config.corsOrigins, credentials: true }))
  app.use(express.json({ limit: '100kb', strict: true }))
  app.use(authenticate(config))
  app.use('/health', healthRouter(config, pool))
  app.use('/api/v1/auth', authRouter(config, pool))
  app.use('/api/v1', parkingRouter(pool))
  app.use((_request, _response, next) => next(new ApiError(404, 'RESOURCE_NOT_FOUND', 'The requested resource was not found.')))
  app.use(errorHandler)
  return app
}

import pg from 'pg'
import type { AppConfig } from '../config.js'

const { Pool } = pg

export function createPool(config: AppConfig) {
  return new Pool({
    connectionString: config.databaseUrl,
    max: 10,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 3_000,
    statement_timeout: 10_000,
  })
}

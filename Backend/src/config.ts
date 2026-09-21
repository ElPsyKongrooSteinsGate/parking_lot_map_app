import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  SERVICE_VERSION: z.string().min(1).default('0.1.0'),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  LOG_LEVEL: z.string().default('info'),
})

export type AppConfig = {
  nodeEnv: 'development' | 'test' | 'production'
  port: number
  serviceVersion: string
  databaseUrl: string
  jwtAccessSecret: string
  accessTokenTtlSeconds: number
  corsOrigins: string[]
  logLevel: string
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = envSchema.parse(env)
  return {
    nodeEnv: parsed.NODE_ENV,
    port: parsed.PORT,
    serviceVersion: parsed.SERVICE_VERSION,
    databaseUrl: parsed.DATABASE_URL,
    jwtAccessSecret: parsed.JWT_ACCESS_SECRET,
    accessTokenTtlSeconds: parsed.ACCESS_TOKEN_TTL_SECONDS,
    corsOrigins: parsed.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean),
    logLevel: parsed.LOG_LEVEL,
  }
}

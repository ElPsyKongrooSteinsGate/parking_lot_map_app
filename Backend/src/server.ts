import { createApp } from './app.js'
import { loadConfig } from './config.js'
import { createPool } from './db/pool.js'

const config = loadConfig()
const pool = createPool(config)
const app = createApp(config, pool)
const server = app.listen(config.port, () => {
  console.log(JSON.stringify({ level: 'info', service: 'osm-map-app-backend', port: config.port, version: config.serviceVersion }))
})

async function shutdown(signal: string) {
  console.log(JSON.stringify({ level: 'info', signal, message: 'Shutting down' }))
  server.close(async () => {
    await pool.end()
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10_000).unref()
}

process.once('SIGTERM', () => void shutdown('SIGTERM'))
process.once('SIGINT', () => void shutdown('SIGINT'))

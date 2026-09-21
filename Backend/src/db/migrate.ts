import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadConfig } from '../config.js'
import { createPool } from './pool.js'

const directory = path.dirname(fileURLToPath(import.meta.url))
const migrationPath = path.join(directory, '../../migrations/001_initial.sql')

const config = loadConfig()
const pool = createPool(config)
try {
  await pool.query(await fs.readFile(migrationPath, 'utf8'))
  console.log('Applied migration 001_initial.sql')
} finally {
  await pool.end()
}

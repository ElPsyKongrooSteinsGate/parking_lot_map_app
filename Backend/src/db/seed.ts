import argon2 from 'argon2'
import { loadConfig } from '../config.js'
import { createPool } from './pool.js'

const config = loadConfig()
const pool = createPool(config)
const passwordHash = await argon2.hash('password123', { type: argon2.argon2id })
const client = await pool.connect()

try {
  await client.query('begin')
  const roleRows = await client.query<{ id: string; code: string }>('select id, code from roles')
  const roles = new Map(roleRows.rows.map((row) => [row.code, row.id]))
  const accounts = [
    ['developer@parkflow.test', 'ParkFlow Developer', 'developer'],
    ['admin@parkflow.test', 'ParkFlow Admin', 'admin'],
    ['manager@parkflow.test', 'ParkFlow Manager', 'parking_manager'],
    ['driver@parkflow.test', 'ParkFlow Driver', 'driver'],
  ] as const
  for (const [email, displayName, role] of accounts) {
    const user = await client.query<{ id: string }>(
      `insert into users (email, password_hash, display_name, status) values ($1, $2, $3, 'active')
       on conflict (email) do update set password_hash = excluded.password_hash, display_name = excluded.display_name, status = 'active'
       returning id`, [email, passwordHash, displayName],
    )
    const userId = user.rows[0]?.id
    const roleId = roles.get(role)
    if (!userId || !roleId) throw new Error(`Missing seed identity for ${role}`)
    await client.query('insert into user_roles (user_id, role_id) values ($1, $2) on conflict do nothing', [userId, roleId])
  }
  const commercial = await client.query<{ id: string }>(
    `insert into commercial_facilities (name, city, region, country_code) values ('ParkFlow Demo Center', 'New York', 'NY', 'US')
     on conflict do nothing returning id`,
  )
  const commercialId = commercial.rows[0]?.id ?? (await client.query<{ id: string }>('select id from commercial_facilities where name = $1', ['ParkFlow Demo Center'])).rows[0]?.id
  if (!commercialId) throw new Error('Could not create demo commercial facility')
  const lots: Array<[string, number]> = [
    ['Downtown Plaza', 120], ['Market Street Garage', 80], ['Harbor View Lot', 95], ['Central Station', 60],
  ]
  for (const [name, capacity] of lots) {
    const lot = await client.query<{ id: string }>(
      `insert into parking_facilities (commercial_facility_id, name, capacity, address_line1, city, region)
       values ($1, $2, $3, 'Demo address', 'New York', 'NY') on conflict do nothing returning id`, [commercialId, name, capacity],
    )
    const lotId = lot.rows[0]?.id ?? (await client.query<{ id: string }>('select id from parking_facilities where name = $1', [name])).rows[0]?.id
    if (!lotId) throw new Error(`Could not create demo parking facility ${name}`)
    await client.query('insert into parking_zones (parking_facility_id, code, name) values ($1, $2, $3) on conflict do nothing', [lotId, name.slice(0, 3).toUpperCase(), `${name} Zone`])
  }
  await client.query('commit')
  console.log('Seeded demo accounts and parking facilities. Demo password: password123')
} catch (error) {
  await client.query('rollback')
  throw error
} finally {
  client.release()
  await pool.end()
}

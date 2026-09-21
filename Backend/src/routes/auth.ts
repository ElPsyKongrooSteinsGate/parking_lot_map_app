import argon2 from 'argon2'
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import type { Pool } from 'pg'
import { z } from 'zod'
import type { AppConfig } from '../config.js'
import { ApiError } from '../errors.js'
import { requireAuth } from '../middleware.js'
import type { AuthenticatedRequest } from '../types.js'

const loginSchema = z.object({ email: z.string().email().max(320).transform((value) => value.toLowerCase()), password: z.string().min(1).max(128) }).strict()

export function authRouter(config: AppConfig, pool: Pool) {
  const router = Router()
  router.post('/login', async (request, response, next) => {
    try {
      const input = loginSchema.parse(request.body)
      const result = await pool.query<{ id: string; email: string; display_name: string; role: AuthenticatedRequest['user'] extends infer T ? T extends { role: infer R } ? R : never : never; status: string; password_hash: string }>(
        `select u.id, u.email, u.display_name, r.code as role, u.status, u.password_hash
         from users u join user_roles ur on ur.user_id = u.id join roles r on r.id = ur.role_id
         where u.email = $1 and u.deleted_at is null limit 1`, [input.email],
      )
      const account = result.rows[0]
      if (!account || account.status !== 'active' || !(await argon2.verify(account.password_hash, input.password))) {
        throw new ApiError(401, 'AUTHENTICATION_FAILED', 'The email or password is invalid.')
      }
      const user = { id: account.id, email: account.email, displayName: account.display_name, role: account.role, status: account.status }
      const accessToken = jwt.sign({ sub: user.id, email: user.email, name: user.displayName, role: user.role }, config.jwtAccessSecret, { expiresIn: config.accessTokenTtlSeconds })
      response.json({ user, accessToken, expiresIn: config.accessTokenTtlSeconds })
    } catch (error) {
      next(error instanceof z.ZodError ? new ApiError(400, 'INVALID_REQUEST', 'The login request is invalid.', error.issues.map((issue) => ({ field: issue.path.join('.'), code: issue.code }))) : error)
    }
  })
  router.get('/me', requireAuth, (request, response) => response.json({ user: (request as AuthenticatedRequest).user }))
  return router
}

import crypto from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ApiError } from './errors.js'
import type { AppConfig } from './config.js'
import type { AuthenticatedRequest, AuthUser, Role } from './types.js'

export function requestContext(request: Request, response: Response, next: NextFunction) {
  const incoming = request.header('x-request-id')
  request.id = incoming && /^[0-9a-f-]{16,64}$/i.test(incoming) ? incoming : crypto.randomUUID()
  response.setHeader('x-request-id', request.id)
  next()
}

export function authenticate(config: AppConfig) {
  return (request: AuthenticatedRequest, _response: Response, next: NextFunction) => {
    const header = request.header('authorization')
    if (!header) return next()
    const [scheme, token] = header.split(' ')
    if (scheme !== 'Bearer' || !token) return next(new ApiError(401, 'AUTHENTICATION_FAILED', 'The access token is invalid.'))
    try {
      const payload = jwt.verify(token, config.jwtAccessSecret) as jwt.JwtPayload
      if (typeof payload.sub !== 'string' || !isRole(payload.role) || typeof payload.email !== 'string') {
        throw new Error('invalid claims')
      }
      request.user = { id: payload.sub, email: payload.email, displayName: String(payload.name ?? ''), role: payload.role, status: 'active' }
      next()
    } catch {
      next(new ApiError(401, 'AUTHENTICATION_FAILED', 'The access token is invalid.'))
    }
  }
}

export function requireAuth(request: AuthenticatedRequest, _response: Response, next: NextFunction) {
  if (!request.user) return next(new ApiError(401, 'AUTHENTICATION_REQUIRED', 'Authentication is required.'))
  next()
}

export function requireRole(...roles: Role[]) {
  return (request: AuthenticatedRequest, _response: Response, next: NextFunction) => {
    if (!request.user || !roles.includes(request.user.role)) return next(new ApiError(403, 'FORBIDDEN', 'You do not have permission to perform this action.'))
    next()
  }
}

function isRole(value: unknown): value is Role {
  return value === 'developer' || value === 'admin' || value === 'parking_manager' || value === 'driver'
}

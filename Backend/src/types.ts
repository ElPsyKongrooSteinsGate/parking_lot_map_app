import type { Request } from 'express'

export type Role = 'developer' | 'admin' | 'parking_manager' | 'driver'
export type AccountStatus = 'active' | 'pending' | 'suspended' | 'closed'

export type AuthUser = {
  id: string
  email: string
  displayName: string
  role: Role
  status: AccountStatus
}

export type AuthenticatedRequest = Request & { user?: AuthUser }

export type MockParkingSpaceType =
  | 'regular'
  | 'pwd'
  | 'senior'
  | 'family'
  | 'vip'
  | 'staff'
  | 'motorcycle'
  | 'bicycle'
  | 'ev_charging'
  | 'loading_service'

export type MockAccountStatus = 'active' | 'suspended'
export type MockAuthorizationAction =
  | 'dashboard:read'
  | 'parking_lot:read'
  | 'parking_space:read'
  | 'parking_space:update'
  | 'parking_space:reserve'

export interface AuthorizationResource {
  type: 'dashboard' | 'parking_lot' | 'parking_space'
  id?: string
  facilityId?: string
  zoneId?: string
  spaceType?: MockParkingSpaceType
  requiresPermit?: boolean
}

export interface AuthorizationRequest {
  action: MockAuthorizationAction
  resource: AuthorizationResource
}

export interface AuthorizationDecision {
  allowed: boolean
  policy: string
  reason: string
}

interface AuthorizationUser {
  id: string
  role: 'developer' | 'admin' | 'parking_manager' | 'driver'
  privileges: ('superadmin' | 'admin' | 'parking_manager' | 'driver')[]
  assignedFacilityIds: string[]
  assignedZoneIds: string[]
  accessibleSpaceTypes: MockParkingSpaceType[]
  permits: MockParkingSpaceType[]
  accountStatus: MockAccountStatus
}

const roleActions: Record<AuthorizationUser['role'], MockAuthorizationAction[]> = {
  developer: ['dashboard:read', 'parking_lot:read', 'parking_space:read', 'parking_space:update', 'parking_space:reserve'],
  admin: ['dashboard:read', 'parking_lot:read', 'parking_space:read', 'parking_space:update', 'parking_space:reserve'],
  parking_manager: ['dashboard:read', 'parking_lot:read', 'parking_space:read', 'parking_space:update'],
  driver: ['parking_lot:read', 'parking_space:read', 'parking_space:reserve'],
}

function hasResourceScope(user: AuthorizationUser, resource: AuthorizationResource) {
  if (user.role === 'developer' || user.role === 'admin') return true
  return Boolean(
    (resource.facilityId && user.assignedFacilityIds.includes(resource.facilityId)) ||
      (resource.zoneId && user.assignedZoneIds.includes(resource.zoneId)),
  )
}

export function evaluateAuthorization(
  user: AuthorizationUser | null,
  request: AuthorizationRequest,
): AuthorizationDecision {
  if (!user) return { allowed: false, policy: 'authenticated-user', reason: 'Authentication is required.' }
  if (user.accountStatus !== 'active') {
    return { allowed: false, policy: 'active-account', reason: 'The account is not active.' }
  }

  const hasRolePermission = roleActions[user.role].includes(request.action)
  if (!hasRolePermission) {
    return { allowed: false, policy: 'rbac-role-permission', reason: 'The role does not grant this action.' }
  }

  if (request.action === 'parking_space:update' && !hasResourceScope(user, request.resource)) {
    return { allowed: false, policy: 'abac-resource-scope', reason: 'The resource is outside the user assignment.' }
  }

  if (request.action === 'parking_space:reserve') {
    const spaceType = request.resource.spaceType ?? 'regular'
    if (!user.accessibleSpaceTypes.includes(spaceType)) {
      return { allowed: false, policy: 'abac-space-type', reason: 'The user cannot use this space type.' }
    }
    if (request.resource.requiresPermit && !user.permits.includes(spaceType)) {
      return { allowed: false, policy: 'pbac-required-permit', reason: 'A permit is required for this space.' }
    }
  }

  return { allowed: true, policy: 'parking-access-policy', reason: 'The request satisfies the applicable policies.' }
}

export function canAccess(
  user: AuthorizationUser | null,
  action: MockAuthorizationAction,
  resource: AuthorizationResource = { type: 'dashboard' },
) {
  return evaluateAuthorization(user, { action, resource }).allowed
}

export async function authorize(
  user: AuthorizationUser | null,
  request: AuthorizationRequest,
): Promise<AuthorizationDecision> {
  return evaluateAuthorization(user, request)
}

export function getAuthorizationPolicies() {
  return [
    { id: 'rbac-role-permission', type: 'RBAC', effect: 'allow' },
    { id: 'abac-resource-scope', type: 'ABAC', effect: 'allow' },
    { id: 'abac-space-type', type: 'ABAC', effect: 'allow' },
    { id: 'pbac-required-permit', type: 'PBAC', effect: 'allow' },
    { id: 'active-account', type: 'PBAC', effect: 'allow' },
  ] as const
}
export interface MockLoginCredentials {
  email: string
  password: string
}

export type MockUserRole = 'developer' | 'admin' | 'parking_manager' | 'driver'
export type MockPrivilege = 'superadmin' | 'admin' | 'parking_manager' | 'driver'

import type { MockAccountStatus, MockParkingSpaceType } from './authorization'

export interface MockAuthUser {
  id: string
  email: string
  name: string
  role: MockUserRole
  privileges: MockPrivilege[]
  assignedFacilityIds: string[]
  assignedZoneIds: string[]
  accessibleSpaceTypes: MockParkingSpaceType[]
  permits: MockParkingSpaceType[]
  accountStatus: MockAccountStatus
}

export interface MockLoginResponse {
  user: MockAuthUser
  accessToken: string
}

export class MockApiError extends Error {}

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds))

/**
 * Temporary mocked replacement for POST /auth/login.
 *
 * Demo accounts all use password123. The existing admin account is retained.
 */
export async function login(
  credentials: MockLoginCredentials,
): Promise<MockLoginResponse> {
  await wait(650)

  const accounts: Record<string, Omit<MockAuthUser, 'email'>> = {
    'developer@parkflow.test': {
      id: 'user-parkflow-developer',
      name: 'ParkFlow Developer',
      role: 'developer',
      privileges: ['superadmin'],
      assignedFacilityIds: ['facility-commercial-building'],
      assignedZoneIds: ['PAZ-N', 'PAZ-E', 'PAZ-S', 'PAZ-W'],
      accessibleSpaceTypes: ['regular', 'pwd', 'senior', 'family', 'vip', 'staff', 'motorcycle', 'bicycle', 'ev_charging', 'loading_service'],
      permits: ['vip', 'staff', 'ev_charging', 'loading_service'],
      accountStatus: 'active',
    },
    'admin@parkflow.test': {
      id: 'user-parkflow-admin',
      name: 'ParkFlow Admin',
      role: 'admin',
      privileges: ['admin'],
      assignedFacilityIds: ['facility-commercial-building'],
      assignedZoneIds: ['PAZ-N', 'PAZ-E', 'PAZ-S', 'PAZ-W'],
      accessibleSpaceTypes: ['regular', 'pwd', 'senior', 'family', 'vip', 'staff', 'motorcycle', 'bicycle', 'ev_charging', 'loading_service'],
      permits: ['vip', 'staff', 'ev_charging', 'loading_service'],
      accountStatus: 'active',
    },
    'manager@parkflow.test': {
      id: 'user-parkflow-manager',
      name: 'ParkFlow Manager',
      role: 'parking_manager',
      privileges: ['parking_manager'],
      assignedFacilityIds: ['facility-commercial-building'],
      assignedZoneIds: ['PAZ-E', 'PAZ-S'],
      accessibleSpaceTypes: ['regular', 'pwd', 'senior', 'family', 'staff', 'motorcycle', 'bicycle', 'ev_charging'],
      permits: ['staff', 'ev_charging'],
      accountStatus: 'active',
    },
    'driver@parkflow.test': {
      id: 'user-parkflow-driver',
      name: 'ParkFlow Driver',
      role: 'driver',
      privileges: ['driver'],
      assignedFacilityIds: [],
      assignedZoneIds: [],
      accessibleSpaceTypes: ['regular', 'pwd', 'senior', 'family', 'motorcycle', 'bicycle', 'ev_charging'],
      permits: [],
      accountStatus: 'active',
    },
  }
  const account = accounts[credentials.email.toLowerCase()]

  if (!account || credentials.password !== 'password123') {
    throw new MockApiError('Invalid email or password. Use the demo credentials to continue.')
  }

  return {
    user: {
      ...account,
      email: credentials.email.toLowerCase(),
    },
    accessToken: `mock-access-token-${account.role}-2026`,
  }
}

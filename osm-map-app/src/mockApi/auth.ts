export interface MockLoginCredentials {
  email: string
  password: string
}

export interface MockAuthUser {
  id: string
  email: string
  name: string
  role: 'admin'
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
 * Demo credentials:
 * email: admin@parkflow.test
 * password: password123
 */
export async function login(
  credentials: MockLoginCredentials,
): Promise<MockLoginResponse> {
  await wait(650)

  if (credentials.email !== 'admin@parkflow.test' || credentials.password !== 'password123') {
    throw new MockApiError('Invalid email or password. Use the demo credentials to continue.')
  }

  return {
    user: {
      id: 'user-parkflow-admin',
      email: 'admin@parkflow.test',
      name: 'ParkFlow Admin',
      role: 'admin',
    },
    accessToken: 'mock-access-token-parkflow-2026',
  }
}

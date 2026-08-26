import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface AuthUser {
  id: string
  email: string
  name?: string
  [key: string]: unknown
}

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  user: AuthUser
  accessToken: string
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
}

/**
 * Sends credentials to `${VITE_API_BASE_URL}/auth/login`.
 * Leave VITE_API_BASE_URL empty when the API is served from the same origin.
 */
export const login = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const body: unknown = await response.json().catch(() => null)
      const payload = body as {
        message?: string
        user?: AuthUser
        accessToken?: string
        access_token?: string
        token?: string
        data?: { user?: AuthUser; accessToken?: string; access_token?: string; token?: string }
      } | null

      if (!response.ok) {
        return rejectWithValue(payload?.message ?? 'Unable to log in. Check your credentials.')
      }

      const user = payload?.user ?? payload?.data?.user
      const accessToken =
        payload?.accessToken ?? payload?.access_token ?? payload?.token ??
        payload?.data?.accessToken ?? payload?.data?.access_token ?? payload?.data?.token

      if (!user || !accessToken) {
        return rejectWithValue('The login response did not include a user and access token.')
      }

      return { user, accessToken }
    } catch {
      return rejectWithValue('Unable to reach the server. Please try again.')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Unable to log in. Please try again.'
      })
  },
})

export const { clearAuthError, logout } = authSlice.actions
export default authSlice.reducer

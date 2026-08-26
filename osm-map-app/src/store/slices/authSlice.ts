import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login as mockLogin, MockApiError } from '../../mockApi'

export interface AuthUser {
  id: string
  email: string
  name?: string
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
 * Uses the temporary local mocked API in src/mockApi/auth.ts.
 */
export const login = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await mockLogin({ email, password })
    } catch (error) {
      return rejectWithValue(
        error instanceof MockApiError ? error.message : 'Unable to log in. Please try again.',
      )
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

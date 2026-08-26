import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import dataReducer from './slices/dataSlice'
import gisDataReducer from './slices/gisDataSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    gisData: gisDataReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

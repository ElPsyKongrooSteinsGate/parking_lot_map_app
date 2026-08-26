import { configureStore } from '@reduxjs/toolkit'
import dataReducer from './dataSlice'
import gisDataReducer from './gisDataSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    data: dataReducer,
    gisData: gisDataReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

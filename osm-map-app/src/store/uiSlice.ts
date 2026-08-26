import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  isSidebarOpen: boolean
  isLoading: boolean
  error: string | null
  selectedLotId: string | null
  selectedSpaceId: string | null
}

const initialState: UiState = {
  isSidebarOpen: true,
  isLoading: false,
  error: null,
  selectedLotId: null,
  selectedSpaceId: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    selectLot: (state, action: PayloadAction<string | null>) => {
      state.selectedLotId = action.payload
      state.selectedSpaceId = null
    },
    selectSpace: (state, action: PayloadAction<string | null>) => {
      state.selectedSpaceId = action.payload
    },
  },
})

export const { setSidebarOpen, setLoading, setError, selectLot, selectSpace } = uiSlice.actions
export default uiSlice.reducer

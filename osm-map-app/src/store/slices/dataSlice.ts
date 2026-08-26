import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ParkingLot, ParkingSpace, ParkingSpaceStatus } from '../../types/data'

interface DataState {
  lots: ParkingLot[]
  spaces: ParkingSpace[]
}

const initialState: DataState = {
  lots: [],
  spaces: [],
}

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setLots: (state, action: PayloadAction<ParkingLot[]>) => {
      state.lots = action.payload
    },
    setSpaces: (state, action: PayloadAction<ParkingSpace[]>) => {
      state.spaces = action.payload
    },
    updateSpaceStatus: (
      state,
      action: PayloadAction<{ id: string; status: ParkingSpaceStatus; vehicleId?: string }>,
    ) => {
      const space = state.spaces.find(({ id }) => id === action.payload.id)
      if (space) {
        space.status = action.payload.status
        space.vehicleId = action.payload.vehicleId
      }
    },
  },
})

export const { setLots, setSpaces, updateSpaceStatus } = dataSlice.actions
export default dataSlice.reducer

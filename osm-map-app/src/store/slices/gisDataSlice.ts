import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Coordinate, GisFeature, MapLayerId } from '../../types/gis'

interface GisDataState {
  features: GisFeature[]
  center: Coordinate
  zoom: number
  enabledLayers: MapLayerId[]
}

const initialState: GisDataState = {
  features: [],
  // Manila; replace with the parking site's default coordinate.
  center: [120.9842, 14.5995],
  zoom: 17,
  enabledLayers: ['parkingLots', 'parkingSpaces'],
}

const gisDataSlice = createSlice({
  name: 'gisData',
  initialState,
  reducers: {
    setFeatures: (state, action: PayloadAction<GisFeature[]>) => {
      state.features = action.payload
    },
    setViewport: (state, action: PayloadAction<{ center: Coordinate; zoom: number }>) => {
      state.center = action.payload.center
      state.zoom = action.payload.zoom
    },
    toggleLayer: (state, action: PayloadAction<MapLayerId>) => {
      const layer = action.payload
      state.enabledLayers = state.enabledLayers.includes(layer)
        ? state.enabledLayers.filter((id) => id !== layer)
        : [...state.enabledLayers, layer]
    },
  },
})

export const { setFeatures, setViewport, toggleLayer } = gisDataSlice.actions
export default gisDataSlice.reducer

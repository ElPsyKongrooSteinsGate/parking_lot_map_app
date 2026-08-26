import type { RootState } from './index'

export const selectParkingLots = (state: RootState) => state.data.lots
export const selectParkingSpaces = (state: RootState) => state.data.spaces
export const selectSelectedLot = (state: RootState) =>
  state.data.lots.find(({ id }) => id === state.ui.selectedLotId) ?? null
export const selectSelectedSpace = (state: RootState) =>
  state.data.spaces.find(({ id }) => id === state.ui.selectedSpaceId) ?? null
export const selectAvailableSpaces = (state: RootState) =>
  state.data.spaces.filter(({ status }) => status === 'available')
export const selectGisFeatures = (state: RootState) => state.gisData.features
export const selectMapViewport = (state: RootState) => ({
  center: state.gisData.center,
  zoom: state.gisData.zoom,
})

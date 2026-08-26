/** A coordinate stored as [longitude, latitude], matching GeoJSON. */
export type Coordinate = [longitude: number, latitude: number]

export type GisFeatureType = 'parkingLot' | 'parkingSpace'
export type MapLayerId = 'parkingLots' | 'parkingSpaces' | 'availability'

/** Spatial data is kept separate from parking business records. */
export interface GisFeature {
  id: string
  entityId: string
  type: GisFeatureType
  geometry: Coordinate[][]
}

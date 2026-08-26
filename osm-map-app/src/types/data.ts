export type ParkingSpaceStatus = 'available' | 'occupied' | 'reserved' | 'disabled'

/** Business data. It deliberately contains no map coordinates or geometry. */
export interface ParkingLot {
  id: string
  name: string
  capacity: number
  occupiedSpaces: number
  address?: string
}

export interface ParkingSpace {
  id: string
  lotId: string
  label: string
  status: ParkingSpaceStatus
  vehicleId?: string
}

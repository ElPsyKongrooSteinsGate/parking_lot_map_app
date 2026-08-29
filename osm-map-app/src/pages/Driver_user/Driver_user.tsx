import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { Layout } from '../../Layout/Layout'
import './Driver_user.css'

const parkingSpots = [
  { id: 'A-12', name: 'Downtown Plaza', position: [40.7128, -74.006] as [number, number], available: 12 },
  { id: 'B-04', name: 'Market Street Garage', position: [40.718, -74.002] as [number, number], available: 6 },
  { id: 'C-09', name: 'Harbor View Lot', position: [40.706, -74.01] as [number, number], available: 9 },
  { id: 'D-02', name: 'Central Station', position: [40.7152, -74.014] as [number, number], available: 3 },
]

export function DriverUser() {
  return (
    <Layout>
      <main className="driver-home">
        <div className="driver-map-panel" aria-label="Parking availability map">
          <MapContainer center={[40.7128, -74.006]} zoom={13} scrollWheelZoom className="driver-map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {parkingSpots.map((spot) => (
              <CircleMarker
                key={spot.id}
                center={spot.position}
                radius={12}
                pathOptions={{
                  color: '#177245',
                  fillColor: '#2ec27e',
                  fillOpacity: 0.8,
                  weight: 2,
                }}
              >
                <Popup>
                  <strong>{spot.name}</strong>
                  <br />
                  {spot.available} spots available
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </main>
    </Layout>
  )
}

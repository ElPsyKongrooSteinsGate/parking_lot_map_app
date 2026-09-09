import { useEffect, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import { useLocation } from 'react-router-dom'
import { Layout } from '../../Layout/Layout'
import './Driver_user.css'

const parkingSpots = [
  { id: 'A-12', name: 'Downtown Plaza', position: [40.7128, -74.006] as [number, number], available: 12, rate: '₱30/hr', distance: '120m away', status: 'available' },
  { id: 'B-04', name: 'Market Street Garage', position: [40.718, -74.002] as [number, number], available: 6, rate: '₱40/hr', distance: '200m away', status: 'limited' },
  { id: 'C-09', name: 'Harbor View Lot', position: [40.706, -74.01] as [number, number], available: 9, rate: '₱25/hr', distance: '300m away', status: 'full' },
  { id: 'D-02', name: 'Central Station', position: [40.7152, -74.014] as [number, number], available: 3, rate: '₱35/hr', distance: '450m away', status: 'available' },
]

export function DriverUser() {
  const location = useLocation()
  const [isParkingPanelOpen, setParkingPanelOpen] = useState(false)

  useEffect(() => {
    setParkingPanelOpen(location.hash === '#find-parking')
  }, [location.hash])

  return (
    <Layout onOpenParkingPanel={() => setParkingPanelOpen(true)}>
      <main className="driver-home">
        <div className="driver-map-panel" aria-label="Parking availability map">
          <MapContainer center={[40.7128, -74.006]} zoom={13} scrollWheelZoom className="driver-map">
            <MapClickHandler onMapClick={() => setParkingPanelOpen(true)} />
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

          {isParkingPanelOpen ? (
            <section className="driver-parking-panel" aria-label="Nearby parking spots">
              <span className="driver-parking-panel__handle" aria-hidden="true" />
              <div className="driver-parking-panel__heading">
                <div>
                  <span className="driver-parking-panel__eyebrow">Your nearby options</span>
                  <h1>Nearby Parking Spots</h1>
                </div>
                <button
                  className="driver-parking-panel__close"
                  type="button"
                  aria-label="Hide nearby parking spots"
                  onClick={() => setParkingPanelOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className="driver-parking-list">
                {parkingSpots.map((spot) => (
                  <article className="driver-parking-card" key={spot.id}>
                    <div className="driver-parking-card__topline">
                      <h2>{spot.name}</h2>
                      <strong>{spot.rate}</strong>
                    </div>
                    <div className="driver-parking-card__details">
                      <span className="driver-parking-card__distance"><i />{spot.distance}</span>
                      <span className={`driver-parking-card__status driver-parking-card__status--${spot.status}`}>
                        <i />{spot.status === 'available' ? 'Slots Available' : spot.status === 'limited' ? 'Limited Slots' : 'Full'}
                      </span>
                    </div>
                    <button
                      className={`driver-parking-card__action driver-parking-card__action--${spot.status}`}
                      type="button"
                      disabled={spot.status === 'full'}
                    >
                      {spot.status === 'full' ? 'Full' : 'Park Here'}
                    </button>
                  </article>
                ))}
              </div>

              <button className="driver-start-parking" type="button">Start Parking</button>
            </section>
          ) : null}
        </div>
      </main>
    </Layout>
  )
}

function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({ click: onMapClick })
  return null
}

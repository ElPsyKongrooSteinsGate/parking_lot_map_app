import { useEffect, useState } from 'react'
import { HiTruck } from 'react-icons/hi'
import { HiMapPin } from 'react-icons/hi2'
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
  const [isParkingDetailsOpen, setParkingDetailsOpen] = useState(false)
  const [isVehicleDetailsOpen, setVehicleDetailsOpen] = useState(false)
  const [licensePlate, setLicensePlate] = useState('')
  const [vehicleType, setVehicleType] = useState('Car')
  const [isParkingNoticeVisible, setParkingNoticeVisible] = useState(false)
  const [isParkingNoticeFading, setParkingNoticeFading] = useState(false)

  useEffect(() => {
    setParkingPanelOpen(location.hash === '#find-parking')
  }, [location.hash])

  useEffect(() => {
    const showNoticeTimer = window.setTimeout(() => {
      setParkingNoticeVisible(true)
    }, 5000)

    const fadeNoticeTimer = window.setTimeout(() => {
      setParkingNoticeFading(true)
    }, 10000)

    const hideNoticeTimer = window.setTimeout(() => {
      setParkingNoticeVisible(false)
    }, 10500)

    return () => {
      window.clearTimeout(showNoticeTimer)
      window.clearTimeout(fadeNoticeTimer)
      window.clearTimeout(hideNoticeTimer)
    }
  }, [])

  function dismissParkingNotice() {
    setParkingNoticeFading(true)
    window.setTimeout(() => setParkingNoticeVisible(false), 500)
  }

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

          {isParkingNoticeVisible ? (
            <aside
              className={`driver-parking-notice ${isParkingNoticeFading ? 'driver-parking-notice--fading' : ''}`}
              role="status"
              aria-label="Nearby parking notification"
            >
              <button
                className="driver-parking-notice__close"
                type="button"
                aria-label="Dismiss parking notification"
                onClick={dismissParkingNotice}
              >
                ×
              </button>
              <div className="driver-parking-notice__content">
                <strong>Ayala Mall Basement Parking</strong>
                <span className="driver-parking-notice__rate">₱25/hr</span>
                <span className="driver-parking-notice__distance"><i />200m away</span>
                <span className="driver-parking-notice__status"><i />Limited Slots</span>
              </div>
              <button className="driver-parking-notice__action" type="button" onClick={() => setParkingPanelOpen(true)}>
                Park Here
              </button>
            </aside>
          ) : null}

          {isVehicleDetailsOpen ? (
            <section className="driver-parking-panel driver-vehicle-details" aria-label="Vehicle details">
              <span className="driver-parking-panel__handle" aria-hidden="true" />
              <div className="driver-vehicle-details__heading">
                <div>
                  <span className="driver-parking-panel__eyebrow">Start Parking</span>
                  <h1>Vehicle Details</h1>
                  <p>Please provide your vehicle information.</p>
                </div>
                <button
                  className="driver-parking-panel__close"
                  type="button"
                  aria-label="Close vehicle details"
                  onClick={() => setVehicleDetailsOpen(false)}
                >
                  ×
                </button>
              </div>

              <label className="driver-vehicle-details__label">
                License Plate Number
                <span className="driver-vehicle-details__plate-field">
                  <HiTruck aria-hidden="true" />
                  <input
                    value={licensePlate}
                    onChange={(event) => setLicensePlate(event.target.value)}
                    placeholder="Enter plate number"
                    aria-label="License plate number"
                  />
                  <select aria-label="Plate location" defaultValue="Cebu">
                    <option>Cebu</option>
                    <option>Manila</option>
                    <option>Davao</option>
                  </select>
                </span>
              </label>

              <fieldset className="driver-vehicle-details__types">
                <legend>Vehicle Type</legend>
                <div className="driver-vehicle-details__type-grid">
                  {['Car', 'Motorcycle', 'SUV / Van', 'Truck'].map((type) => (
                    <button
                      className={vehicleType === type ? 'driver-vehicle-details__type driver-vehicle-details__type--selected' : 'driver-vehicle-details__type'}
                      type="button"
                      key={type}
                      onClick={() => setVehicleType(type)}
                      aria-pressed={vehicleType === type}
                    >
                      <span className={`driver-vehicle-details__vehicle-icon driver-vehicle-details__vehicle-icon--${type === 'SUV / Van' ? 'suv' : type.toLowerCase()}`} aria-hidden="true" />
                      <span>{type}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <section className="driver-vehicle-details__information" aria-labelledby="parking-information-title">
                <h2 id="parking-information-title">Parking Information</h2>
                <div className="driver-vehicle-details__information-card">
                  <div><span className="driver-vehicle-details__info-icon">◷</span><span><strong>Rate</strong><small>₱30.00 per hour</small></span></div>
                  <div><span className="driver-vehicle-details__info-icon">□</span><span><strong>Operating Hours</strong><small>Open 24 Hours</small></span></div>
                </div>
              </section>

              <div className="driver-vehicle-details__terms">
                <span className="driver-vehicle-details__terms-icon">i</span>
                <span>By starting your parking session, you agree to the parking rules and terms.</span>
                <button type="button">View Rules</button>
              </div>

              <button className="driver-vehicle-details__confirm" type="button" disabled={!licensePlate.trim()}>
                <span aria-hidden="true">⌗</span>Start Parking
              </button>
              <p className="driver-vehicle-details__confirmation-note">✦ Your parking session will start after confirmation.</p>
            </section>
          ) : isParkingDetailsOpen ? (
            <section className="driver-parking-panel driver-parking-details" aria-label="Parking space details">
              <span className="driver-parking-panel__handle" aria-hidden="true" />
              <div className="driver-parking-details__heading">
                <div>
                  <h1>IT Park Open Parking</h1>
                  <p><HiMapPin />Cebu IT Park, Cebu City</p>
                </div>
                <span className="driver-parking-details__availability">Available</span>
              </div>

              <div className="driver-parking-details__stats">
                <div><span className="driver-parking-details__stat-icon driver-parking-details__stat-icon--check">✓</span><strong>28 Slots Available</strong></div>
                <div><span className="driver-parking-details__capacity-icon" /><strong>Total Capacity <b>150</b></strong></div>
                <div><span className="driver-parking-details__stat-icon driver-parking-details__stat-icon--clock">L</span><strong>Open 24 Hours</strong></div>
                <div><span className="driver-parking-details__stat-icon driver-parking-details__stat-icon--rate">₱</span><strong>Rate <b>₱30</b> per hour</strong></div>
              </div>

              <div className="driver-parking-details__rules">
                <h2><span className="driver-parking-details__rules-icon">!</span>Rules</h2>
                <ul>
                  <li>No overnight parking</li>
                  <li>Cars only</li>
                  <li>Cashless payment available</li>
                </ul>
              </div>

              <div className="driver-parking-details__actions">
                <button className="driver-parking-details__directions" type="button"><HiMapPin />Get Directions</button>
                <button
                  className="driver-parking-details__start"
                  type="button"
                  onClick={() => {
                    setParkingDetailsOpen(false)
                    setVehicleDetailsOpen(true)
                  }}
                >
                  <HiTruck />Start Parking
                </button>
              </div>
              <button
                className="driver-parking-panel__close driver-parking-details__close"
                type="button"
                aria-label="Close parking details"
                onClick={() => setParkingDetailsOpen(false)}
              >
                ×
              </button>
            </section>
          ) : isParkingPanelOpen ? (
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

              <button
                className="driver-start-parking"
                type="button"
                onClick={() => {
                  setParkingPanelOpen(false)
                  setParkingDetailsOpen(true)
                }}
              >
                Start Parking
              </button>
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

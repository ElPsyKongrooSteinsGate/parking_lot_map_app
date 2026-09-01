import { useState } from 'react'
import { HiChartBar, HiCog, HiOfficeBuilding, HiPencil, HiTruck } from 'react-icons/hi'
import { HiMapPin } from 'react-icons/hi2'
import { Layout } from '../../../Layout/Layout'
import { Modal } from '../../../components/modal'
import './Parking_spaces.css'

export function ParkingSpaces() {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

  return <Layout>
    <main className="parking-spaces">
      <div className="parking-spaces__notice"><HiChartBar /><div><strong>MVP Plan: You can manage one parking space.</strong><span>Upgrade your plan to add more parking spaces.</span></div><button type="button">Upgrade Plan</button></div>
      <div className="parking-spaces__grid">
        <section className="parking-card parking-form">
          <div className="parking-card__heading"><div><h1>Parking Space Details</h1><p>Set up your parking space information</p></div><span>Status <b>Active</b></span></div>
          <label>Parking Space Name <em>*</em><input defaultValue="IT Park Open Parking" /></label>
          <div className="parking-form__two"><label>Address <em>*</em><div className="parking-form__address-field"><input className="parking-form__address-input" defaultValue="Cebu IT Park, Apas, Cebu City, Cebu 6000" /><div className="parking-form__address-actions"><button type="button" aria-label="Open address map settings" onClick={() => setIsAddressModalOpen(true)}><HiMapPin /></button><button type="button" aria-label="Configure parking address"><HiCog /></button></div></div></label><label>Zone / Area<input defaultValue="Lot A" /></label></div>
          <div className="parking-form__two"><label>Total Parking Slots <em>*</em><input defaultValue="150" /><small>Total number of vehicles your space can accommodate</small></label><label>Hourly Rate (₱) <em>*</em><input defaultValue="30" /><small>Base rate per hour</small></label></div>
          <label>Operating Hours <em>*</em><div className="parking-form__hours"><select defaultValue="Open 24 Hours"><option>Open 24 Hours</option></select><span>+</span><select defaultValue="24/7"><option>24/7</option></select></div></label>
          <label>Description<textarea defaultValue={'Open parking space for IT Park employees and visitors.\nEasy access to all major buildings.'} /></label>
          <fieldset><legend>Vehicle Types</legend><div className="parking-form__checks"><label><input type="checkbox" defaultChecked /> Car</label><label><input type="checkbox" defaultChecked /> Motorcycle</label><label><input type="checkbox" defaultChecked /> SUV / Van</label><label><input type="checkbox" /> Truck</label></div></fieldset>
          <button className="parking-spaces__save" type="button"><HiPencil />Save Changes</button>
        </section>
        <section className="parking-card parking-overview">
          <div><h2>Parking Space Overview</h2><p>This is how your space will appear to drivers</p></div>
          <div className="parking-overview__photo"><span>Available</span></div>
          <h3>IT Park Open Parking</h3><p className="parking-overview__location"><HiOfficeBuilding />Cebu IT Park, Apas, Cebu City</p>
          <div className="parking-overview__stats"><Stat icon={<HiPencil />} label="Rate" value="₱30 / hour" /><Stat icon={<HiChartBar />} label="Operating Hours" value="24 Hours" /><Stat icon={<HiOfficeBuilding />} label="Total Slots" value="150" /><Stat icon={<HiTruck />} label="Vehicle Types" value="Car, Motorcycle, SUV / Van" /></div>
          <div className="parking-overview__tip"><HiChartBar /><span>You can only have one parking space in MVP plan.<b>Upgrade your plan to add more parking spaces.</b></span></div>
          <button className="parking-overview__upgrade" type="button"><HiPencil />Upgrade Plan</button>
        </section>
      </div>
    </main>

    <Modal isOpen={isAddressModalOpen} title="Address settings" onClose={() => setIsAddressModalOpen(false)}>
      <div className="parking-address-modal">
        <div className="parking-address-modal__search">
          <span className="parking-address-modal__search-icon"><HiMapPin /></span>
          <input defaultValue="Cebu IT Park, Apas, Cebu City, Cebu 6000" />
          <button type="button">Apply</button>
        </div>

        <div className="parking-address-modal__map" aria-label="Map preview">
          <div className="map-road map-road--vertical" />
          <div className="map-road map-road--horizontal" />
          <div className="map-road map-road--diag" />
          <div className="map-pin map-pin--active"><span /></div>
          <div className="map-pin map-pin--secondary"><span /></div>
          <div className="map-pin map-pin--small"><span /></div>
        </div>

        <div className="parking-address-modal__list">
          <button type="button" className="parking-address-modal__option active">
            <span className="parking-address-modal__option-marker">A</span>
            <span>
              <strong>Cebu IT Park</strong>
              <small>Apas, Cebu City</small>
            </span>
          </button>
          <button type="button" className="parking-address-modal__option">
            <span className="parking-address-modal__option-marker">B</span>
            <span>
              <strong>One Central</strong>
              <small>Banilad, Cebu City</small>
            </span>
          </button>
          <button type="button" className="parking-address-modal__option">
            <span className="parking-address-modal__option-marker">C</span>
            <span>
              <strong>Metro Cebu Business Park</strong>
              <small>Talamban, Cebu City</small>
            </span>
          </button>
        </div>
      </div>
    </Modal>
  </Layout>
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="parking-overview__stat"><span>{icon}</span><b>{label}</b><strong>{value}</strong></div>
}
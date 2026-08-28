import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { HiBell, HiCalendar, HiCog, HiOfficeBuilding, HiViewGrid } from 'react-icons/hi'
import { useLocation } from 'react-router-dom'
import './DriverSidebar.css'

interface DriverSidebarProps {
  isOpen: boolean
  onNavigate: () => void
}

const driverNavigation = [
  { label: 'Find parking', icon: HiViewGrid, href: '#find-parking' },
  { label: 'My reservations', icon: HiCalendar, href: '#reservations' },
  { label: 'Saved locations', icon: HiOfficeBuilding, href: '#saved-locations' },
  { label: 'Notifications', icon: HiBell, href: '#notifications' },
  { label: 'My profile', icon: HiCog, href: '#profile' },
]

export function DriverSidebar({ isOpen, onNavigate }: DriverSidebarProps) {
  const location = useLocation()

  return <Sidebar aria-label="Driver navigation" className={`driver-sidebar ${isOpen ? 'driver-sidebar--open' : ''}`}>
    <div className="driver-sidebar__brand"><span>P</span><strong>ParkCebu<small>DRIVER</small></strong></div>
    <SidebarItems>
      <SidebarItemGroup>
        {driverNavigation.map(({ label, icon: Icon, href }) => <SidebarItem key={label} href={href} active={location.hash === href.slice(1)} icon={Icon} onClick={onNavigate}>{label}</SidebarItem>)}
      </SidebarItemGroup>
    </SidebarItems>
    <div className="driver-sidebar__status"><span />Driver features<br /><strong>Under development</strong></div>
  </Sidebar>
}

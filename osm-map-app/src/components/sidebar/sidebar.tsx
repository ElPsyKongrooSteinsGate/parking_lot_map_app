import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HiBell, HiCalendar, HiChartBar, HiCog, HiDocumentText, HiOfficeBuilding, HiTag, HiTruck, HiViewGrid } from 'react-icons/hi'
import { useAppSelector } from '../../store/hooks'
import { selectAuthUser } from '../../store/selectors'
import './sidebar.css'

interface AppSidebarProps {
  isOpen: boolean
  onNavigate: () => void
}

export function AppSidebar({ isOpen, onNavigate }: AppSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAppSelector(selectAuthUser)
  const isDriver = user?.role === 'driver'

  const navigation = isDriver
    ? [
      { label: 'Find parking', icon: HiViewGrid, href: '#find-parking' },
      { label: 'My reservations', icon: HiCalendar, href: '#reservations' },
      { label: 'Saved locations', icon: HiOfficeBuilding, href: '#saved-locations' },
      { label: 'Notifications', icon: HiBell, href: '#notifications' },
      { label: 'My profile', icon: HiCog, href: '#profile' },
    ]
    : [
      { label: 'Dashboard', icon: HiViewGrid, href: '/dashboard' },
      { label: 'Parking Spaces', icon: HiOfficeBuilding, href: '/parking-spaces' },
      { label: 'Active Vehicles', icon: HiTruck, href: '#active-vehicles' },
      { label: 'Revenue', icon: HiChartBar, href: '#revenue' },
      { label: 'Rates', icon: HiTag, href: '#rates' },
      { label: 'Reports', icon: HiDocumentText, href: '#reports' },
      { label: 'Notifications', icon: HiDocumentText, href: '#notifications' },
      { label: 'Settings', icon: HiCog, href: '#settings' },
    ]

  function handleRouteClick(path: string, event: React.MouseEvent<HTMLElement>) {
    event.preventDefault()
    navigate(path)
    onNavigate()
  }

  return (
    <Sidebar aria-label="Application navigation" className={`app-sidebar ${isOpen ? 'app-sidebar--open' : ''}`}>
      <div className="app-sidebar__brand"><span>P</span><strong>ParkCebu<small>{isDriver ? 'DRIVER' : 'OPERATOR'}</small></strong></div>
      <SidebarItems>
        <SidebarItemGroup>
          {navigation.map(({ label, icon: Icon, href }) => <SidebarItem key={label} href={href} active={href.startsWith('/') ? location.pathname === href : location.hash === href.slice(1)} icon={Icon} onClick={href.startsWith('/') ? (event) => handleRouteClick(href, event) : onNavigate}>{label}{label === 'Notifications' && !isDriver && <b className="app-sidebar__badge">3</b>}</SidebarItem>)}
        </SidebarItemGroup>
      </SidebarItems>
      {!isDriver && <div className="app-sidebar__lot"><span className="app-sidebar__lot-image" /><div><strong>IT Park Open<br />Parking</strong></div><span>⌄</span></div>}
      <div className="app-sidebar__user"><span className="app-sidebar__avatar">{user?.name?.slice(0, 2).toUpperCase() ?? 'US'}</span><div><strong>{user?.name ?? 'User'}</strong><small>{isDriver ? 'Driver' : user?.role ?? 'Operator'}</small></div><span>⌄</span></div>
    </Sidebar>
  )
}

import { Navbar as FlowbiteNavbar, NavbarBrand } from 'flowbite-react'
import { HiBell, HiCalendar, HiMenuAlt1, HiQuestionMarkCircle } from 'react-icons/hi'
import { useLocation } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { selectAuthUser } from '../../store/selectors'
import './navbar.css'

interface NavbarProps {
  onMenuClick: () => void
  onLogout: () => void
}

/** Reusable app navigation rendered by the shared application layout. */
export function Navbar({ onMenuClick, onLogout }: NavbarProps) {
  const user = useAppSelector(selectAuthUser)
  const location = useLocation()
  const isDriver = user?.role === 'driver'
  const pageTitle = location.pathname === '/parking-spaces' ? 'Parking Spaces' : isDriver ? 'Driver portal' : 'Dashboard'
  const firstName = user?.name?.split(' ')[0] ?? 'User'

  return (
    <FlowbiteNavbar fluid className="app-navbar">
      <div className="app-navbar__content">
        <button className="app-navbar__menu" type="button" aria-label="Toggle navigation menu" onClick={onMenuClick}>
          <HiMenuAlt1 aria-hidden="true" />
        </button>
        <NavbarBrand href={isDriver ? '/driver' : '/dashboard'} className="app-navbar__brand">
          <span className="app-navbar__logo-mark">P</span>
          <span className="app-navbar__logo">ParkCebu<small>{isDriver ? 'DRIVER' : 'OPERATOR'}</small></span>
        </NavbarBrand>
        <div className="app-navbar__heading"><strong>{pageTitle}</strong><span>Welcome back, {firstName}!</span></div>
        <div className="app-navbar__actions">
          <button className="app-navbar__date" type="button"><span>May 20, 2024</span><HiCalendar aria-hidden="true" /></button>
          <button className="app-navbar__icon" type="button" aria-label="Notifications"><HiBell aria-hidden="true" /><b /></button>
          <button className="app-navbar__icon" type="button" aria-label="Help"><HiQuestionMarkCircle aria-hidden="true" /></button>
          <button className="app-navbar__logout" type="button" onClick={onLogout} aria-label="Log out">×</button>
        </div>
      </div>
    </FlowbiteNavbar>
  )
}

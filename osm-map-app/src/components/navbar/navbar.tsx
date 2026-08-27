import { Navbar as FlowbiteNavbar, NavbarBrand } from 'flowbite-react'
import { HiBell, HiCalendar, HiMenuAlt1, HiQuestionMarkCircle } from 'react-icons/hi'
import './navbar.css'

interface NavbarProps {
  onMenuClick: () => void
  onLogout: () => void
}

/** Reusable app navigation rendered by the shared application layout. */
export function Navbar({ onMenuClick, onLogout }: NavbarProps) {
  return (
    <FlowbiteNavbar fluid className="app-navbar">
      <div className="app-navbar__content">
        <button className="app-navbar__menu" type="button" aria-label="Toggle navigation menu" onClick={onMenuClick}>
          <HiMenuAlt1 aria-hidden="true" />
        </button>
        <NavbarBrand href="/dashboard" className="app-navbar__brand">
          <span className="app-navbar__logo-mark">P</span>
          <span className="app-navbar__logo">ParkCebu<small>OPERATOR</small></span>
        </NavbarBrand>
        <div className="app-navbar__heading"><strong>Dashboard</strong><span>Welcome back, Juan!</span></div>
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

import { Navbar as FlowbiteNavbar, NavbarBrand } from 'flowbite-react'
import { HiMenuAlt1 } from 'react-icons/hi'
import './navbar.css'

interface NavbarProps {
  onMenuClick: () => void
}

/** Reusable app navigation rendered by the shared application layout. */
export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <FlowbiteNavbar fluid className="app-navbar">
      <div className="app-navbar__content">
        <button className="app-navbar__menu" type="button" aria-label="Toggle navigation menu" onClick={onMenuClick}>
          <HiMenuAlt1 aria-hidden="true" />
        </button>
        <NavbarBrand href="/dashboard" className="app-navbar__brand">
          <span className="app-navbar__logo-mark">P</span>
          <span className="app-navbar__logo">Park<span>Flow</span></span>
        </NavbarBrand>
        <label className="app-navbar__search">
          <span className="app-navbar__search-label">Search</span>
          <input type="search" placeholder="Search parking lots or spaces" />
        </label>
      </div>
    </FlowbiteNavbar>
  )
}

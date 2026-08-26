import { Navbar as FlowbiteNavbar, NavbarBrand } from 'flowbite-react'
import { HiMenuAlt1 } from 'react-icons/hi'
import './navbar.css'

/** Reusable app navigation. It is intentionally not mounted on the Dashboard yet. */
export function Navbar() {
  return (
    <FlowbiteNavbar fluid className="app-navbar">
      <NavbarBrand href="/" className="app-navbar__brand">
        <span className="app-navbar__menu" aria-label="Navigation menu">
          <HiMenuAlt1 aria-hidden="true" />
        </span>
        <span className="app-navbar__logo-mark">P</span>
        <span className="app-navbar__logo">Park<span>Flow</span></span>
        <label className="app-navbar__search">
          <span className="app-navbar__search-label">Search</span>
          <input type="search" placeholder="Search parking lots or spaces" />
        </label>
      </NavbarBrand>
    </FlowbiteNavbar>
  )
}

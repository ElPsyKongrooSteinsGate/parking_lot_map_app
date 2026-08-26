import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import './sidebar.css'

interface AppSidebarProps {
  isOpen: boolean
  onNavigate: () => void
}

export function AppSidebar({ isOpen, onNavigate }: AppSidebarProps) {
  return (
    <Sidebar aria-label="Application navigation" className={`app-sidebar ${isOpen ? 'app-sidebar--open' : ''}`}>
      <p className="app-sidebar__heading">WORKSPACE</p>
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="/dashboard" active onClick={onNavigate}>Dashboard</SidebarItem>
          <SidebarItem href="#parking-lots" onClick={onNavigate}>Parking lots</SidebarItem>
          <SidebarItem href="#parking-spaces" onClick={onNavigate}>Parking spaces</SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}

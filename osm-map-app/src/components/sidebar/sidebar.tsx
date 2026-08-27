import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { HiChartBar, HiCog, HiDocumentText, HiOfficeBuilding, HiTag, HiTruck, HiViewGrid } from 'react-icons/hi'
import './sidebar.css'

interface AppSidebarProps {
  isOpen: boolean
  onNavigate: () => void
}

export function AppSidebar({ isOpen, onNavigate }: AppSidebarProps) {
  return (
    <Sidebar aria-label="Application navigation" className={`app-sidebar ${isOpen ? 'app-sidebar--open' : ''}`}>
      <div className="app-sidebar__brand"><span>P</span><strong>ParkCebu<small>OPERATOR</small></strong></div>
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="/dashboard" active icon={HiViewGrid} onClick={onNavigate}>Dashboard</SidebarItem>
          <SidebarItem href="#parking-lots" icon={HiOfficeBuilding} onClick={onNavigate}>Parking Lots</SidebarItem>
          <SidebarItem href="#active-vehicles" icon={HiTruck} onClick={onNavigate}>Active Vehicles</SidebarItem>
          <SidebarItem href="#revenue" icon={HiChartBar} onClick={onNavigate}>Revenue</SidebarItem>
          <SidebarItem href="#rates" icon={HiTag} onClick={onNavigate}>Rates</SidebarItem>
          <SidebarItem href="#reports" icon={HiDocumentText} onClick={onNavigate}>Reports</SidebarItem>
          <SidebarItem href="#notifications" icon={HiDocumentText} onClick={onNavigate}><span>Notifications</span><b className="app-sidebar__badge">3</b></SidebarItem>
          <SidebarItem href="#settings" icon={HiCog} onClick={onNavigate}>Settings</SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
      <div className="app-sidebar__lot"><span className="app-sidebar__lot-image" /><div><strong>IT Park Open<br />Parking</strong></div><span>⌄</span></div>
      <div className="app-sidebar__user"><span className="app-sidebar__avatar">JD</span><div><strong>Juan Dela Cruz</strong><small>Operator</small></div><span>⌄</span></div>
    </Sidebar>
  )
}

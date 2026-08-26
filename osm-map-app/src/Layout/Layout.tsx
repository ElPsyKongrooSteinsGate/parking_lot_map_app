import { useState, type ReactNode } from 'react'
import { Navbar } from '../components/navbar/navbar'
import { AppSidebar } from '../components/sidebar/sidebar'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">
      <Navbar onMenuClick={() => setSidebarOpen((isOpen) => !isOpen)} />
      <div className="app-layout__body">
        <button
          className={`app-layout__backdrop ${isSidebarOpen ? 'app-layout__backdrop--visible' : ''}`}
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
        <AppSidebar isOpen={isSidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        <div className="app-layout__content">{children}</div>
      </div>
    </div>
  )
}

import { useState, type ReactNode } from 'react'
import { HiMenuAlt1 } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectAuthUser } from '../../store/selectors'
import { logout } from '../../store/slices/authSlice'
import { DriverSidebar } from './DriverSidebar'
import './DriverLayout.css'

interface DriverLayoutProps {
  children: ReactNode
}

export function DriverLayout({ children }: DriverLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const user = useAppSelector(selectAuthUser)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  function handleLogout() {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return <div className="driver-layout">
    <header className="driver-layout__header">
      <button className="driver-layout__menu" type="button" aria-label="Toggle driver navigation menu" onClick={() => setSidebarOpen((isOpen) => !isOpen)}><HiMenuAlt1 aria-hidden="true" /></button>
      <div className="driver-layout__title"><strong>ParkCebu</strong><span>Driver portal</span></div>
      <div className="driver-layout__account"><span>{user?.name?.slice(0, 1) ?? 'D'}</span><div><strong>{user?.name ?? 'Driver'}</strong><small>{user?.email}</small></div><button type="button" onClick={handleLogout}>Log out</button></div>
    </header>
    <div className="driver-layout__body">
      <button className={`driver-layout__backdrop ${isSidebarOpen ? 'driver-layout__backdrop--visible' : ''}`} type="button" aria-label="Close driver navigation menu" onClick={() => setSidebarOpen(false)} />
      <DriverSidebar isOpen={isSidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className="driver-layout__content">{children}</div>
    </div>
  </div>
}

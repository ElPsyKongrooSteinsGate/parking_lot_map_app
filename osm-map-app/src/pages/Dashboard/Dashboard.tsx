import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectAuthUser } from '../../store/selectors'
import './Dashboard.css'

export function Dashboard() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(selectAuthUser)

  function handleLogout() {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <main className="dashboard">
      <header className="dashboard__header">
        <a className="dashboard__brand" href="/dashboard">Park<span>Flow</span></a>
        <button type="button" onClick={handleLogout}>Log out</button>
      </header>
      <section className="dashboard__content">
        <p className="dashboard__eyebrow">PARKING DASHBOARD</p>
        <h1>Welcome, {user?.name ?? 'driver'}.</h1>
        <p>Your parking map and availability controls will appear here.</p>
      </section>
    </main>
  )
}

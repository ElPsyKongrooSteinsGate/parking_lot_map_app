import { Layout } from '../../Layout/Layout'
import { useAppSelector } from '../../store/hooks'
import { selectAuthUser } from '../../store/selectors'
import './Dashboard.css'

export function Dashboard() {
  const user = useAppSelector(selectAuthUser)

  return (
    <Layout>
      <main className="dashboard">
        <header className="dashboard__header"><span>Dashboard</span></header>
        <section className="dashboard__content">
          <p className="dashboard__eyebrow">PARKING DASHBOARD</p>
          <h1>Welcome, {user?.name ?? 'driver'}.</h1>
          <p>Your parking map and availability controls will appear here.</p>
        </section>
      </main>
    </Layout>
  )
}

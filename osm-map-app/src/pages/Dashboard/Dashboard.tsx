import { HiChartBar, HiEye, HiPencil, HiQrcode, HiTruck } from 'react-icons/hi'
import { Layout } from '../../Layout/Layout'
import { useAppSelector } from '../../store/hooks'
import { selectAuthUser } from '../../store/selectors'
import './Dashboard.css'
import './DashboardMobile.css'

const vehicles = [
  ['ABC 1234', 'Toyota Fortuner', 'White', '9:10 AM', '1h 35m', '₱45.00'],
  ['XYZ 5678', 'Honda City', 'Silver', '9:45 AM', '1h 00m', '₱30.00'],
  ['GHI 9012', 'Mitsubishi Xpander', 'Black', '10:05 AM', '40m', '₱20.00'],
  ['DEF 3456', 'Yamaha NMAX', 'Black', '10:20 AM', '25m', '₱10.00'],
  ['JKL 7890', 'Suzuki Ertiga', 'Gray', '10:30 AM', '15m', '₱10.00'],
]

export function Dashboard() {
  const user = useAppSelector(selectAuthUser)
  const firstName = user?.name?.split(' ')[0] ?? 'Juan'

  return <Layout><main className="dashboard">
    <div className="dashboard__welcome">Welcome back, {firstName}.</div>
    <div className="dashboard__metrics"><Metric icon="P" tone="blue" label="Total Slots" value="150" note="All parking slots" /><Metric icon={<HiTruck />} tone="green" label="Available Slots" value="32" note="21% available" positive /><Metric icon={<HiTruck />} tone="orange" label="Occupied Slots" value="118" note="79% occupied" /><Metric icon="♟" tone="purple" label="Vehicles Today" value="186" note="Total entries" /><Metric icon="₱" tone="green" label="Today's Revenue" value="₱8,420" note="+12% vs yesterday" positive /></div>
    <div className="dashboard__grid"><div className="dashboard__left"><section className="panel availability"><h2>Slot Availability</h2><div className="availability__body"><div className="donut"><strong>150</strong><span>Total Slots</span></div><div className="legend"><Legend color="green" label="Available" value="32 (21%)" /><Legend color="orange" label="Occupied" value="118 (79%)" /><Legend color="gray" label="Reserved" value="0 (0%)" /></div></div><button className="outline-button"><HiPencil />Update Availability</button></section><section className="panel quick"><h2>Quick Actions</h2><div className="quick__actions"><Quick icon={<HiQrcode />} label="Scan QR Code" sub="Check-in" /><Quick icon={<HiTruck />} label="Add Vehicle" sub="Manual Entry" /><Quick icon="⇥" label="End Parking" sub="By Plate No." /><Quick icon={<HiChartBar />} label="Release Pass" sub="Season Pass" /></div></section><section className="panel activity"><div className="panel__title"><h2>Recent Activity</h2><a href="#activity">View All</a></div><Activity icon="🚙" title="New check-in: ABC 1234" detail="Toyota Fortuner  •  9:10 AM" meta="Just now" green /><Activity icon="⇥" title="Check-out: PQR 6789" detail="Honda City  •  8:30 AM" meta="₱30.00" red /><Activity icon="▦" title="QR Scan Check-in: XYZ 5678" detail="Honda City  •  9:45 AM" meta="15 min ago" blue /></section></div><div className="dashboard__right"><section className="panel vehicles"><div className="panel__title"><h2>Active Vehicles</h2><a href="#vehicles">View All</a></div><div className="vehicle-table"><div className="vehicle-table__head"><span>PLATE NO.</span><span>VEHICLE</span><span>TIME IN</span><span>DURATION</span><span>AMOUNT</span><span>ACTION</span></div>{vehicles.map(([plate, vehicle, color, time, duration, amount]) => <div className="vehicle-table__row" key={plate}><b>{plate}</b><span><strong>{vehicle}</strong><small>{color}</small></span><span>{time}</span><span className="duration">{duration}</span><span>{amount}</span><button><HiEye />View</button></div>)}</div></section><section className="panel revenue"><div className="panel__title"><h2>Revenue Summary</h2><a href="#report">View Report</a></div><div className="revenue__body"><div className="revenue__numbers"><span>Today</span><strong>₱8,420</strong><em>+12% vs yesterday</em><hr /><span>Yesterday <b>₱7,500</b></span><span>This Week <b>₱54,320</b></span><span>This Month <b>₱210,430</b></span></div><div className="chart"><div className="chart__line"><svg viewBox="0 0 500 190" preserveAspectRatio="none"><polyline points="0,170 20,174 40,168 60,172 80,165 100,138 120,145 140,100 160,94 180,56 200,75 220,47 240,50 260,20 280,65 300,35 320,53 340,58 360,89 380,75 400,99 420,81 440,85 460,64 480,73 500,45" /></svg></div><div className="chart__labels"><span>12 AM</span><span>4 AM</span><span>8 AM</span><span>12 PM</span><span>4 PM</span><span>8 PM</span><span>12 AM</span></div></div></div></section></div></div>
  </main></Layout>
}

function Metric({ icon, tone, label, value, note, positive }: { icon: React.ReactNode; tone: string; label: string; value: string; note: string; positive?: boolean }) { return <article className="metric"><span className={`metric__icon metric__icon--${tone}`}>{icon}</span><div><label>{label}</label><strong>{value}</strong><small className={positive ? 'positive' : ''}>{note}</small></div></article> }
function Legend({ color, label, value }: { color: string; label: string; value: string }) { return <div className="legend__item"><i className={`legend__dot legend__dot--${color}`} /><span>{label}</span><b>{value}</b></div> }
function Quick({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) { return <button className="quick__item"><span>{icon}</span><strong>{label}</strong><small>{sub}</small></button> }
function Activity({ icon, title, detail, meta, green, red }: { icon: React.ReactNode; title: string; detail: string; meta: string; green?: boolean; red?: boolean; blue?: boolean }) { return <div className="activity__item"><span className={`activity__icon ${green ? 'green' : red ? 'red' : 'blue'}`}>{icon}</span><div><strong>{title}</strong><small>{detail}</small></div><b>{meta}</b></div> }

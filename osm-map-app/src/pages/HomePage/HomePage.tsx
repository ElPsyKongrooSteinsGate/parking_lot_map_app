import { useState, type FormEvent } from 'react'
import './HomePage.css'

export function HomePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <main className="home-page">
      <section className="home-page__brand" aria-label="Parking map overview">
        <a className="home-page__logo" href="/" aria-label="ParkFlow home"><span className="home-page__logo-mark">P</span><span>Park<span>Flow</span></span></a>
        <div className="home-page__message"><p className="home-page__eyebrow">PARKING MANAGEMENT</p><h1>Find. Park. Move with confidence.</h1><p>See parking availability and manage your spaces from one connected map.</p></div>
        <div className="home-page__map-art" aria-hidden="true"><span className="home-page__map-road home-page__map-road--one" /><span className="home-page__map-road home-page__map-road--two" /><span className="home-page__map-pin home-page__map-pin--one" /><span className="home-page__map-pin home-page__map-pin--two" /><span className="home-page__map-pin home-page__map-pin--three" /><span className="home-page__parking-sign">P</span></div>
        <p className="home-page__copyright">© 2026 ParkFlow. All rights reserved.</p>
      </section>
      <section className="home-page__access"><div className="home-page__form-wrap"><div className="home-page__language">◉&nbsp; English</div><header><h2>Welcome back!</h2><p>Sign in to access your parking dashboard.</p></header><form className="login-form" onSubmit={handleSubmit}><label htmlFor="email">Email address</label><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" autoComplete="email" required /><div className="login-form__label-row"><label htmlFor="password">Password</label><a href="#forgot-password">Forgot password?</a></div><input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required /><button type="submit">Log in</button></form><p className="home-page__signup">Don&apos;t have an account? <a href="#sign-up">Sign up here</a></p></div></section>
    </main>
  )
}

import heroImage from '../../assets/hero.png'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'
import './Hero.css'

export function Hero() {
  return (
    <div className="hero">
      <img src={heroImage} className="hero__base" width="170" height="179" alt="" />
      <img src={reactLogo} className="hero__framework" alt="React logo" />
      <img src={viteLogo} className="hero__vite" alt="Vite logo" />
      fuck you
    </div>
  )
}

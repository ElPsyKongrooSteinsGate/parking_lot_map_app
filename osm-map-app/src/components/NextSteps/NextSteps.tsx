import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'
import './NextSteps.css'

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/vitejs/vite', icon: 'github-icon' },
  { label: 'Discord', href: 'https://chat.vite.dev/', icon: 'discord-icon' },
  { label: 'X.com', href: 'https://x.com/vite_js', icon: 'x-icon' },
  { label: 'Bluesky', href: 'https://bsky.app/profile/vite.dev', icon: 'bluesky-icon' },
]

export function NextSteps() {
  return (
    <section className="next-steps">
      <article className="next-steps__panel next-steps__panel--documentation">
        <svg className="next-steps__icon" role="presentation" aria-hidden="true">
          <use href="/icons.svg#documentation-icon" />
        </svg>
        <h2>Documentation</h2>
        <p>Your questions, answered</p>
        <ul className="next-steps__links">
          <li>
            <a href="https://vite.dev/" target="_blank" rel="noreferrer">
              <img className="next-steps__logo" src={viteLogo} alt="" />
              Explore Vite
            </a>
          </li>
          <li>
            <a href="https://react.dev/" target="_blank" rel="noreferrer">
              <img className="next-steps__button-icon" src={reactLogo} alt="" />
              Learn more
            </a>
          </li>
        </ul>
      </article>

      <article className="next-steps__panel">
        <svg className="next-steps__icon" role="presentation" aria-hidden="true">
          <use href="/icons.svg#social-icon" />
        </svg>
        <h2>Connect with us</h2>
        <p>Join the Vite community</p>
        <ul className="next-steps__links">
          {socialLinks.map(({ label, href, icon }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer">
                <svg className="next-steps__button-icon" role="presentation" aria-hidden="true">
                  <use href={`/icons.svg#${icon}`} />
                </svg>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}

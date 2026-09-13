import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, IconButton, MenuIcon, CloseIcon } from '../common'
import { NAV_ITEMS, type NavItem } from '../../data/navigation'
import styles from './Header.module.css'

interface NavLinkProps {
  item: NavItem
  className: string
  onClick?: () => void
}

/**
 * Only sections with real, populated content get an `href`. The rest have
 * no page worth visiting yet, so they render as disabled labels with a
 * "Soon" marker instead of a link to an empty page.
 */
function NavLink({ item, className, onClick }: NavLinkProps) {
  if (!item.href) {
    return (
      <span className={`${className} ${styles.disabled}`} aria-disabled="true">
        {item.label}
        <span className={styles.soon}>Soon</span>
      </span>
    )
  }

  return (
    <Link to={item.href} className={className} onClick={onClick}>
      {item.label}
    </Link>
  )
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to content
      </a>
      <Container className={styles.inner}>
        <Link to="/" className={styles.wordmark}>
          AVENGERS: DOOMSDAY
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <NavLink item={item} className={`text-label ${styles.navLink}`} />
              </li>
            ))}
          </ul>
        </nav>

        <IconButton
          className={styles.menuToggle}
          icon={isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        />
      </Container>

      {isMenuOpen && (
        <nav className={styles.mobileNav} aria-label="Primary mobile">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <NavLink item={item} className="text-h3" onClick={() => setIsMenuOpen(false)} />
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

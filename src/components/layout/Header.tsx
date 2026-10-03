import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Container, IconButton, MenuIcon, CloseIcon, SearchIcon } from '../common'
import { NAV_ITEMS, SEARCH_PATH, type NavItem } from '../../data/navigation'
import styles from './Header.module.css'

interface NavLinkProps {
  item: NavItem
  className: string
  pathname: string
  onClick?: () => void
}

/** Home matches only itself; a section also owns its detail pages (`/news` → `/news/:slug`). */
function isCurrent(href: string, pathname: string): boolean {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Only sections with real, populated content get an `href`. The rest have
 * no page worth visiting yet, so they render as disabled labels with a
 * "Soon" marker instead of a link to an empty page.
 */
function NavLink({ item, className, pathname, onClick }: NavLinkProps) {
  if (!item.href) {
    return (
      <span className={`${className} ${styles.disabled}`} aria-disabled="true">
        {item.label}
        <span className={styles.soon}>Soon</span>
      </span>
    )
  }

  return (
    <Link
      to={item.href}
      className={className}
      aria-current={isCurrent(item.href, pathname) ? 'page' : undefined}
      onClick={onClick}
    >
      {item.label}
    </Link>
  )
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const onSearchPage = pathname === SEARCH_PATH

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
                <NavLink item={item} className={`text-label ${styles.navLink}`} pathname={pathname} />
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Link
            to={SEARCH_PATH}
            className={styles.searchLink}
            aria-label="Search"
            aria-current={onSearchPage ? 'page' : undefined}
            onClick={() => setIsMenuOpen(false)}
          >
            <SearchIcon aria-hidden="true" />
          </Link>
          <IconButton
            className={styles.menuToggle}
            icon={isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          />
        </div>
      </Container>

      {isMenuOpen && (
        <nav className={styles.mobileNav} aria-label="Primary mobile">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <NavLink
                  item={item}
                  className={`text-h3 ${styles.mobileLink}`}
                  pathname={pathname}
                  onClick={() => setIsMenuOpen(false)}
                />
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

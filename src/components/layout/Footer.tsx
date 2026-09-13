import { Container } from '../common'
import { siteConfig } from '../../config/site'
import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.wordmark}>AVENGERS: DOOMSDAY</span>
          <span className="text-metadata">{siteConfig.domain}</span>
        </div>
        <p className={`text-caption ${styles.disclaimer}`}>{siteConfig.disclaimer}</p>
        <p className="text-metadata">© {year} {siteConfig.siteName}. Fan-made, unofficial.</p>
      </Container>
    </footer>
  )
}

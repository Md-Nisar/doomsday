import { Container } from './Container'
import styles from './RouteFallback.module.css'

/**
 * Suspense fallback for lazy-loaded routes. Deliberately just text — no
 * spinner/animation — since the lazy chunks are small and this should be
 * on screen for a moment at most on any reasonable connection.
 */
export function RouteFallback() {
  return (
    <Container as="main" id="main-content" className={styles.wrapper}>
      <p className="text-caption">Loading…</p>
    </Container>
  )
}

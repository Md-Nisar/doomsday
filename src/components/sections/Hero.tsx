import { Container } from '../common'
import styles from './Hero.module.css'

/**
 * Cinematic hero. The backdrop is pure CSS (gradients + a faint grid) so
 * there is no image weight and nothing that resembles official artwork.
 */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={`${styles.backdrop} ambient-glow`} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />
      <Container className={styles.inner}>
        <span className="text-label">Unofficial fan project</span>
        <h1 id="hero-heading" className={`text-display ${styles.title}`}>
          AVENGERS: DOOMSDAY
        </h1>
        <p className={`text-h3 ${styles.tagline}`}>The countdown has begun.</p>
        <p className={`text-subheading ${styles.lede}`}>
          A fan-built destination for the countdown, news, theories and everything surrounding
          Avengers: Doomsday.
        </p>
        <p className={`text-caption ${styles.note}`}>
          Not affiliated with Marvel Studios, Marvel, or Disney.
        </p>
      </Container>
    </section>
  )
}

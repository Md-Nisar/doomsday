import { Link } from 'react-router-dom'
import { Container } from '../common'
import styles from './NotFoundContent.module.css'

interface NotFoundContentProps {
  title?: string
  description?: string
}

/**
 * Shared "not found" body — used both for unmatched app routes and for a
 * detail page whose slug doesn't match any real content.
 */
export function NotFoundContent({
  title = 'Page not found',
  description = "This page doesn't exist yet, or it moved.",
}: NotFoundContentProps) {
  return (
    <Container as="section" className={styles.wrapper}>
      <p className="text-label">Avengers: Doomsday</p>
      <h1 className="text-h1">{title}</h1>
      <p className="text-subheading">{description}</p>
      <Link to="/" className={`text-label ${styles.link}`}>
        Back to Avengers: Doomsday
      </Link>
    </Container>
  )
}

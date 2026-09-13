import { Surface } from './Surface'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  title: string
  description: string
}

/**
 * Renders when a collection has no real, sourced content yet. Deliberately
 * plain — this communicates intentional curation, not a broken page, so it
 * must never look like a loading skeleton or a fabricated placeholder card.
 */
export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Surface level="base" className={styles.empty}>
      <p className="text-h3">{title}</p>
      <p className="text-caption">{description}</p>
    </Surface>
  )
}

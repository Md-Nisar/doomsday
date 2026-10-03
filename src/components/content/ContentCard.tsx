import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card, StatusBadge } from '../common'
import type { ContentStatus } from '../../types/content'
import styles from './ContentCard.module.css'

interface ContentCardProps {
  /** Omit for entities with no detail page (e.g. timeline events). */
  href?: string
  eyebrow?: string
  title: string
  description: string
  status?: ContentStatus
  /** Overrides the automatic `StatusBadge` — for entities graded on a different vocabulary (e.g. `RumorStatusBadge`). */
  badge?: ReactNode
  meta?: ReactNode
  /** A `MediaThumb` (or other visual), rendered full-bleed above the card body. Omit entirely for card types with no media concept (rumors, theories, timeline) — this never renders a placeholder on its own. */
  media?: ReactNode
  /** Defaults to `h2`; pass `h3` when the card sits under a section heading. */
  headingLevel?: 'h2' | 'h3'
  /**
   * Marks unconfirmed material (rumors, theories) with a dashed edge and no green hover — a shape cue, so it never looks confirmed.
   * Purely presentational: the status badge remains the authoritative signal.
   */
  speculative?: boolean
}

/**
 * The one card shape reused across every index page (news, trailers, cast,
 * characters, theories, rumors, timeline) — differences between entity
 * types are just which props get passed, not a new component per category.
 */
export function ContentCard({
  href,
  eyebrow,
  title,
  description,
  status,
  badge,
  meta,
  media,
  headingLevel: Heading = 'h2',
  speculative,
}: ContentCardProps) {
  // Defaults from the editorial status; pass explicitly for entities graded on another vocabulary (rumor lifecycle).
  const isSpeculative = speculative ?? (status === 'rumor' || status === 'theory')
  const cardClass = [styles.card, isSpeculative && styles.speculative].filter(Boolean).join(' ')
  const body = (
    <>
      {media && <div className={styles.media}>{media}</div>}
      <div className={styles.header}>
        {eyebrow && <span className="text-label">{eyebrow}</span>}
        {badge ?? (status && <StatusBadge status={status} />)}
      </div>
      <Heading className="text-h3">{title}</Heading>
      <p className="text-caption">{description}</p>
      {meta && <div className={`text-metadata ${styles.meta}`}>{meta}</div>}
    </>
  )

  if (href) {
    return (
      <Link to={href} className={styles.link}>
        {/* tabIndex -1: the link is the single tab stop; the card only mirrors its hover/focus look. */}
        <Card interactive tabIndex={-1} className={cardClass}>
          {body}
          <span className={styles.cue} aria-hidden="true">
            →
          </span>
        </Card>
      </Link>
    )
  }

  return <Card className={cardClass}>{body}</Card>
}

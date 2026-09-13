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
}

/**
 * The one card shape reused across every index page (news, trailers, cast,
 * characters, theories, rumors, timeline) — differences between entity
 * types are just which props get passed, not a new component per category.
 */
export function ContentCard({ href, eyebrow, title, description, status, badge, meta, media }: ContentCardProps) {
  const body = (
    <>
      {media && <div className={styles.media}>{media}</div>}
      <div className={styles.header}>
        {eyebrow && <span className="text-label">{eyebrow}</span>}
        {badge ?? (status && <StatusBadge status={status} />)}
      </div>
      <h2 className="text-h3">{title}</h2>
      <p className="text-caption">{description}</p>
      {meta && <div className={`text-metadata ${styles.meta}`}>{meta}</div>}
    </>
  )

  if (href) {
    return (
      <Link to={href} className={styles.link}>
        <Card interactive className={styles.card}>
          {body}
        </Card>
      </Link>
    )
  }

  return <Card className={styles.card}>{body}</Card>
}

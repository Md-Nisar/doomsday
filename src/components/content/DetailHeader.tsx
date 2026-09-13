import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../common'
import type { ContentStatus } from '../../types/content'
import styles from './DetailHeader.module.css'

interface DetailHeaderProps {
  backHref: string
  backLabel: string
  eyebrow?: string
  title: string
  status?: ContentStatus
  /** Overrides the automatic `StatusBadge` — for entities graded on a different vocabulary (e.g. `RumorStatusBadge`). */
  badge?: ReactNode
  meta?: ReactNode
}

/** Shared shell for every detail page: back link, title, status, metadata. */
export function DetailHeader({ backHref, backLabel, eyebrow, title, status, badge, meta }: DetailHeaderProps) {
  return (
    <header>
      <Link to={backHref} className={`text-label ${styles.back}`}>
        ← {backLabel}
      </Link>
      <div className={styles.titleRow}>
        <h1 className="text-h1">{title}</h1>
        {badge ?? (status && <StatusBadge status={status} />)}
      </div>
      {eyebrow && <p className="text-subheading">{eyebrow}</p>}
      {meta && <p className={`text-metadata ${styles.meta}`}>{meta}</p>}
    </header>
  )
}

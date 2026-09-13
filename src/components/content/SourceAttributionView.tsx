import type { SourceAttribution } from '../../types/content'
import { formatContentDate } from '../../utils/date'
import styles from './SourceAttributionView.module.css'

interface SourceAttributionViewProps {
  source?: SourceAttribution
  publishedAt?: string
  updatedAt?: string
}

/**
 * Provenance is a core product feature, not an afterthought — every
 * sourced entity renders this rather than burying the source in body text.
 */
export function SourceAttributionView({ source, publishedAt, updatedAt }: SourceAttributionViewProps) {
  if (!source && !publishedAt) return null

  return (
    <div className={styles.wrapper}>
      {source && (
        <span className="text-caption">
          Source:{' '}
          <a href={source.url} className={styles.link} target="_blank" rel="noopener noreferrer">
            {source.name}
          </a>
        </span>
      )}
      {publishedAt && (
        <span className="text-metadata">Published {formatContentDate(publishedAt)}</span>
      )}
      {updatedAt && updatedAt !== publishedAt && (
        <span className="text-metadata">Updated {formatContentDate(updatedAt)}</span>
      )}
    </div>
  )
}

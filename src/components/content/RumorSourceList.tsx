import type { RumorSource, RumorSourceRole, RumorSourceType, SourceReliability } from '../../types/content'
import { formatContentDate } from '../../utils/date'
import styles from './RumorSourceList.module.css'

const TYPE_LABEL: Record<RumorSourceType, string> = {
  OFFICIAL: 'Official',
  TRADE_PRESS: 'Trade press',
  MAJOR_OUTLET: 'Major outlet',
  JOURNALIST: 'Journalist',
  INTERVIEW: 'Interview',
  SOCIAL: 'Social post',
  AGGREGATOR: 'Aggregator',
  UNKNOWN: 'Unknown source',
}

const ROLE_LABEL: Record<RumorSourceRole, string> = {
  FIRST_REPORT: 'First report',
  CORROBORATION: 'Corroborates',
  CONTRADICTION: 'Contradicts',
  CONFIRMATION: 'Confirms',
  CONTEXT: 'Context',
}

const RELIABILITY_LABEL: Record<SourceReliability, string> = {
  HIGH: 'High reliability',
  MEDIUM: 'Medium reliability',
  LOW: 'Low reliability',
  UNKNOWN: 'Reliability unknown',
}

interface RumorSourceListProps {
  sources: RumorSource[]
}

/**
 * Renders a set of `RumorSource` entries chronologically — the one list
 * reused for "Source history" (all sources), "Corroboration" (pre-filtered
 * to `CORROBORATION`/`CONFIRMATION`), and "Contradictions" (pre-filtered to
 * `CONTRADICTION`), so those three views can never drift out of sync with
 * the rumor's actual source data. Renders nothing for an empty list, same
 * convention as `RelatedContent`/`TrailerTimestamps`.
 */
export function RumorSourceList({ sources }: RumorSourceListProps) {
  if (sources.length === 0) return null
  const sorted = [...sources].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt))

  return (
    <ol className={styles.list}>
      {sorted.map((source, index) => (
        <li key={`${source.url}-${index}`} className={styles.item}>
          <div className={styles.heading}>
            <span className="text-label">{ROLE_LABEL[source.role]}</span>
            <span className="text-metadata">{formatContentDate(source.publishedAt)}</span>
          </div>
          <p className={styles.name}>
            <a href={source.url} className={styles.link} target="_blank" rel="noopener noreferrer">
              {source.name}
            </a>
            {source.author && <span className="text-metadata"> · {source.author}</span>}
          </p>
          <p className="text-caption">{source.summary}</p>
          <div className={styles.tags}>
            <span className="text-metadata">{TYPE_LABEL[source.type]}</span>
            <span className="text-metadata">{RELIABILITY_LABEL[source.reliability]}</span>
          </div>
        </li>
      ))}
    </ol>
  )
}

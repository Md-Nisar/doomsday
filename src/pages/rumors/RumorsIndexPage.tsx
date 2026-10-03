import { useState } from 'react'
import { Container, CardGrid, EmptyState, RumorStatusBadge, SectionHeading } from '../../components/common'
import type { RumorStatus } from '../../components/common'
import { ContentCard } from '../../components/content'
import { CATEGORIES } from '../../data/categories'
import { useContentList } from '../../hooks/useContentList'
import { useDocumentSeo } from '../../hooks/useDocumentSeo'
import { getRumors } from '../../lib/content'
import { formatContentDate } from '../../utils/date'
import styles from './RumorsIndexPage.module.css'

type FilterValue = RumorStatus | 'all'

const FILTERS: Array<{ label: string; value: FilterValue }> = [
  { label: 'All', value: 'all' },
  { label: 'Unverified', value: 'UNVERIFIED' },
  { label: 'Reported', value: 'REPORTED' },
  { label: 'Corroborated', value: 'CORROBORATED' },
  { label: 'Disputed', value: 'DISPUTED' },
  { label: 'Debunked', value: 'DEBUNKED' },
  { label: 'Confirmed', value: 'CONFIRMED' },
]

export function RumorsIndexPage() {
  useDocumentSeo({
    title: CATEGORIES.rumors.label,
    description:
      "Tracked Avengers: Doomsday claims — who's reporting them, how credible they are, and what's actually confirmed.",
    path: CATEGORIES.rumors.path,
  })

  const { items, loading } = useContentList(getRumors)
  const [filter, setFilter] = useState<FilterValue>('all')

  const sorted = [...items].sort((a, b) =>
    (b.lastUpdatedAt ?? b.firstReportedAt).localeCompare(a.lastUpdatedAt ?? a.firstReportedAt),
  )
  const filtered = filter === 'all' ? sorted : sorted.filter((rumor) => rumor.status === filter)

  return (
    <Container as="main" id="main-content">
      <SectionHeading
        level="h1"
        eyebrow="Rumor Intelligence"
        title="What's being claimed"
        description="What's being claimed, who's claiming it, how credible it is — and what's actually confirmed. Never presented as settled fact."
      />

      {items.length > 0 && (
        <div className={styles.filters} role="group" aria-label="Filter by rumor status">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={styles.filterButton}
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <EmptyState
          title="No rumors tracked yet"
          description="Nothing sufficiently sourced yet — this fills in as reporting warrants it."
        />
      )}

      {!loading && items.length > 0 && filtered.length === 0 && (
        <EmptyState title="No rumors match this filter" description="Try a different status above." />
      )}

      {filtered.length > 0 && (
        <CardGrid>
          {filtered.map((rumor) => (
            <ContentCard
              key={rumor.id}
              href={`${CATEGORIES.rumors.path}/${rumor.slug}`}
              title={rumor.title}
              description={rumor.summary}
              badge={<RumorStatusBadge status={rumor.status} />}
              speculative={rumor.status !== 'CONFIRMED'}
              meta={
                <>
                  {formatContentDate(rumor.lastUpdatedAt ?? rumor.firstReportedAt)}
                  {` · ${rumor.sources.length} source${rumor.sources.length === 1 ? '' : 's'}`}
                  {rumor.confidence && ` · Confidence: ${rumor.confidence}`}
                </>
              }
            />
          ))}
        </CardGrid>
      )}
    </Container>
  )
}

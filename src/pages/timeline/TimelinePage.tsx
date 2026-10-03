import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Card, Container, EmptyState, Reveal, SectionHeading, StatusBadge } from '../../components/common'
import { SourceAttributionView } from '../../components/content'
import { CATEGORIES } from '../../data/categories'
import { useContentList } from '../../hooks/useContentList'
import { useDocumentSeo } from '../../hooks/useDocumentSeo'
import { getTimeline } from '../../lib/content'
import { getTimelineEventConnections } from '../../lib/relationships'
import type { TimelineEvent } from '../../types/content'
import { formatContentDate } from '../../utils/date'
import styles from './TimelinePage.module.css'

const EVENT_TYPE_LABEL: Record<string, string> = {
  production: 'Production',
  marketing: 'Marketing',
  release: 'Release',
  casting: 'Casting',
  other: 'Other',
}

interface TimelineRow {
  event: TimelineEvent
  characterNames: string[]
  characterSlugs: string[]
}

export function TimelinePage() {
  useDocumentSeo({
    title: CATEGORIES.timeline.label,
    description: 'A chronological, sourced timeline of confirmed Avengers: Doomsday developments.',
    path: CATEGORIES.timeline.path,
  })

  const loadTimeline = useCallback(async (): Promise<TimelineRow[]> => {
    const events = await getTimeline()
    return Promise.all(
      events.map(async (event) => {
        const connections = await getTimelineEventConnections(event.id)
        return {
          event,
          characterNames: connections.characters.map((character) => character.name),
          characterSlugs: connections.characters.map((character) => character.slug),
        }
      }),
    )
  }, [])

  const { items, loading } = useContentList(loadTimeline)

  return (
    <Container as="main" id="main-content">
      <SectionHeading
        level="h1"
        eyebrow="Timeline"
        title="Timeline"
        description="Confirmed developments in order — no unverified production rumors."
      />
      {!loading && items.length === 0 && (
        <EmptyState title="No events recorded yet" description="Nothing confirmed yet to place on the timeline." />
      )}
      {items.length > 0 && (
        <ol className={styles.list}>
          {items.map(({ event, characterNames, characterSlugs }) => (
            <Reveal as="li" key={event.id} className={styles.event}>
              <Card className={styles.card}>
                <div className={styles.eventHeader}>
                  <span className="text-label">{EVENT_TYPE_LABEL[event.type]}</span>
                  <StatusBadge status={event.status} />
                  <span className="text-metadata">{formatContentDate(event.date)}</span>
                </div>
                <h2 className="text-h3">{event.title}</h2>
                <p className="text-caption">{event.description}</p>
                <SourceAttributionView source={event.source} />
                <div className={styles.links}>
                  {event.relatedNewsSlug && (
                    <Link to={`${CATEGORIES.news.path}/${event.relatedNewsSlug}`} className={`text-label ${styles.link}`}>
                      Read the story →
                    </Link>
                  )}
                  {characterNames.map((name, index) => (
                    <Link
                      key={characterSlugs[index]}
                      to={`${CATEGORIES.characters.path}/${characterSlugs[index]}`}
                      className={`text-label ${styles.link}`}
                    >
                      {name} →
                    </Link>
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </ol>
      )}
    </Container>
  )
}

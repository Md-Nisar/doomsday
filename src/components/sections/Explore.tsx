import { Link } from 'react-router-dom'
import { Container, Reveal, SectionHeading } from '../common'
import { ContentCard } from '../content'
import { CATEGORIES } from '../../data/categories'
import { useContentList } from '../../hooks/useContentList'
import { getCharacters, getNews, getTimeline, getTrailers } from '../../lib/content'
import { formatContentDate } from '../../utils/date'
import styles from './Explore.module.css'

const FEATURED_CHARACTER_COUNT = 3
const TIMELINE_PREVIEW_COUNT = 2

/**
 * A live preview of the content platform, built from whatever's actually
 * populated in `src/data/*` today. A category with nothing in it simply
 * contributes no card — this never fills empty space with placeholders.
 */
export function Explore() {
  const { items: news } = useContentList(getNews)
  const { items: trailers } = useContentList(getTrailers)
  const { items: characters } = useContentList(getCharacters)
  const { items: timeline } = useContentList(getTimeline)

  const latestNews = [...news].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0]
  const latestTrailer = [...trailers].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))[0]
  const featuredCharacters = characters.slice(0, FEATURED_CHARACTER_COUNT)
  const recentTimeline = [...timeline].reverse().slice(0, TIMELINE_PREVIEW_COUNT)

  const hasContent = latestNews || latestTrailer || featuredCharacters.length > 0

  if (!hasContent) return null

  return (
    <section className={styles.section}>
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Inside Doomsday"
            title="What's confirmed so far"
            description="Sourced and up to date — with links to everything as it's added."
          />
        </Reveal>
        <Reveal className={styles.grid} index={1}>
          {latestNews && (
            <ContentCard
              href={`${CATEGORIES.news.path}/${latestNews.slug}`}
              eyebrow="Latest news"
              title={latestNews.title}
              description={latestNews.excerpt}
              status={latestNews.status}
              meta={formatContentDate(latestNews.publishedAt)}
            />
          )}
          {latestTrailer && (
            <ContentCard
              href={`${CATEGORIES.trailers.path}/${latestTrailer.slug}`}
              eyebrow="Latest trailer"
              title={latestTrailer.title}
              description={latestTrailer.description}
              meta={formatContentDate(latestTrailer.releaseDate)}
            />
          )}
          {featuredCharacters.map((character) => (
            <ContentCard
              key={character.id}
              href={`${CATEGORIES.characters.path}/${character.slug}`}
              eyebrow={character.actor}
              title={character.name}
              description={character.description}
              status={character.status}
            />
          ))}
        </Reveal>

        {recentTimeline.length > 0 && (
          <Reveal className={styles.timeline}>
            {recentTimeline.map((event) => (
              <div key={event.id} className={styles.timelineRow}>
                <span className="text-metadata">{formatContentDate(event.date)}</span>
                <span className="text-caption">{event.title}</span>
              </div>
            ))}
            <Link to={CATEGORIES.timeline.path} className={`text-label ${styles.timelineLink}`}>
              View full timeline →
            </Link>
          </Reveal>
        )}
      </Container>
    </section>
  )
}

import { Container, CardGrid, EmptyState, FilmIcon, SectionHeading } from '../../components/common'
import { ContentCard, MediaThumb } from '../../components/content'
import { CATEGORIES } from '../../data/categories'
import { useContentList } from '../../hooks/useContentList'
import { useDocumentSeo } from '../../hooks/useDocumentSeo'
import { getTrailers } from '../../lib/content'
import { formatContentDate } from '../../utils/date'
import { formatDuration } from '../../utils/duration'

const TRAILER_TYPE_LABEL: Record<string, string> = {
  teaser: 'Teaser',
  trailer: 'Trailer',
  special_look: 'Special Look',
  tv_spot: 'TV Spot',
  clip: 'Clip',
  clock: 'Doomsday Clock',
  other: 'Promotional footage',
}

export function TrailersIndexPage() {
  useDocumentSeo({
    title: CATEGORIES.trailers.label,
    description: 'Every official Avengers: Doomsday trailer, teaser, and special look, in release order — with what each one actually establishes.',
    path: CATEGORIES.trailers.path,
  })

  const { items, loading } = useContentList(getTrailers)
  const chronological = [...items].sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))

  return (
    <Container as="main" id="main-content">
      <SectionHeading
        level="h1"
        eyebrow="Trailer Intelligence"
        title="All official footage"
        description="Officially released video material, in release order, linked to its source — never re-hosted or copied from unofficial reuploads."
      />
      {!loading && chronological.length === 0 && (
        <EmptyState
          title="No trailers released yet"
          description="Nothing official to show yet — this fills in as Marvel Studios releases trailer material."
        />
      )}
      {chronological.length > 0 && (
        <CardGrid>
          {chronological.map((trailer) => (
            <ContentCard
              key={trailer.id}
              href={`${CATEGORIES.trailers.path}/${trailer.slug}`}
              eyebrow={TRAILER_TYPE_LABEL[trailer.type]}
              title={trailer.title}
              description={trailer.description}
              media={
                <MediaThumb
                  media={trailer.thumbnail}
                  fallbackIcon={<FilmIcon />}
                  fallbackLabel="No verified official thumbnail available yet"
                  showPlayIndicator
                />
              }
              meta={
                trailer.duration
                  ? `${formatContentDate(trailer.releaseDate)} · ${formatDuration(trailer.duration)}`
                  : formatContentDate(trailer.releaseDate)
              }
            />
          ))}
        </CardGrid>
      )}
    </Container>
  )
}

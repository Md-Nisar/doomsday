import { Container, CardGrid, EmptyState, SectionHeading, UserIcon } from '../../components/common'
import { ContentCard, MediaThumb } from '../../components/content'
import { CATEGORIES } from '../../data/categories'
import { useContentList } from '../../hooks/useContentList'
import { useDocumentSeo } from '../../hooks/useDocumentSeo'
import { getCast } from '../../lib/content'

export function CastIndexPage() {
  useDocumentSeo({
    title: CATEGORIES.cast.label,
    description: 'Confirmed Avengers: Doomsday cast — who is playing whom, sourced to official announcements.',
    path: CATEGORIES.cast.path,
  })

  const { items, loading } = useContentList(getCast)

  return (
    <Container as="main" id="main-content">
      <SectionHeading
        level="h1"
        eyebrow="Cast"
        title="Confirmed cast"
        description="Actor and role, kept clearly distinct — only what's officially confirmed."
      />
      {!loading && items.length === 0 && (
        <EmptyState
          title="No cast confirmed yet"
          description="Nothing officially announced yet — this fills in as casting is confirmed."
        />
      )}
      {items.length > 0 && (
        <CardGrid>
          {items.map((person) => (
            <ContentCard
              key={person.id}
              href={`${CATEGORIES.cast.path}/${person.slug}`}
              eyebrow={person.role}
              title={person.name}
              description={person.description}
              meta={person.source ? `Source: ${person.source.name}` : undefined}
              media={
                <MediaThumb
                  media={person.image}
                  fallbackIcon={<UserIcon />}
                  fallbackLabel={`No portrait available yet for ${person.name}`}
                  fallbackName={person.name}
                  aspect="portrait"
                />
              }
            />
          ))}
        </CardGrid>
      )}
    </Container>
  )
}
